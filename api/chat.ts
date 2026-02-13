
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import { getPool } from './_db.js';
import { getClientIp } from './_utils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  
  // 1. Security: Strict Input Validation
  // This blocks the "     " (empty spaces) attack demonstrated in your curl example
  if (!message || typeof message !== 'string' || message.trim().length < 2) {
    return res.status(400).json({ error: 'Message is invalid or too short' });
  }

  // Prevent huge payloads consuming tokens
  if (message.length > 500) {
    return res.status(400).json({ error: 'Message is too long' });
  }

  try {
    const db = getPool();
    const userIp = getClientIp(req);
    const now = Date.now();

    // 2. Security: Database-backed Rate Limiting
    // This prevents Replay Attacks / Flooding by enforcing a cooldown
    const COOLDOWN_MS = 5000; // 5 Seconds cooldown between messages
    
    const rateCheck = await db.query(
      'SELECT timestamp FROM rate_limits WHERE uid = $1 AND type = $2', 
      [userIp, 'chat_limit']
    );

    if (rateCheck.rows.length > 0) {
      const lastTime = parseInt(rateCheck.rows[0].timestamp);
      if (now - lastTime < COOLDOWN_MS) {
        // Reject request immediately without calling AI API
        return res.status(429).json({ error: 'Too many requests. Please wait.' });
      }
    }

    // Initialize Gemini API securely on the server
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Define the persona and instructions
    const systemContext = `أنت مساعد ذكي ومحفز للشباب تابع لجمعية "شباب فور إرشاد".
            شخصيتك: ودود، حكيم، محفز، وتتحدث بأسلوب شبابي راقٍ ومحترم.
            مهامك:
            1. الإجابة عن أسئلة حول الجمعية (التسجيل، الأهداف، الرؤية) بناءً على المعلومات العامة للجمعيات الشبانية.
            2. تقديم نصائح عامة للشباب في مجالات: تطوير الذات، أهمية التطوع، القيادة، والمهارات الحياتية.
            3. لا تقتصر إجاباتك على محتوى الموقع فقط، بل كن موسوعة معرفية مفيدة للشباب.
            4. تحدث دائماً باللغة العربية.`;

    // Combine system context with user message since gemma-3-27b-it doesn't support systemInstruction config
    const fullPrompt = `${systemContext}\n\nسؤال المستخدم: ${message}`;

    const result = await ai.models.generateContent({
      model: 'gemma-3-27b-it',
      contents: fullPrompt,
    });

    const responseText = result.text;

    // 3. Update Rate Limit Timestamp AFTER successful processing (or before to be stricter)
    await db.query(
      `INSERT INTO rate_limits (uid, type, timestamp) VALUES ($1, $2, $3)
       ON CONFLICT (uid, type) DO UPDATE SET timestamp = $3`,
      [userIp, 'chat_limit', now]
    );

    return res.status(200).json({ response: responseText });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to generate response" });
  }
}

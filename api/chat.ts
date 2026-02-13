
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Initialize Gemini API securely on the server
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Create a chat model
    // We use a stateless approach here for simplicity, or we could pass history from frontend if needed
    // For this implementation, we re-initialize the chat with the system instruction.
    const chat = ai.chats.create({
      model: 'gemma-3-27b-it', // Using a fast, standard model
      config: {
        systemInstruction: `أنت مساعد ذكي ومحفز للشباب تابع لجمعية "شباب فور إرشاد".
            شخصيتك: ودود، حكيم، محفز، وتتحدث بأسلوب شبابي راقٍ ومحترم.
            مهامك:
            1. الإجابة عن أسئلة حول الجمعية (التسجيل، الأهداف، الرؤية) بناءً على المعلومات العامة للجمعيات الشبانية.
            2. تقديم نصائح عامة للشباب في مجالات: تطوير الذات، أهمية التطوع، القيادة، والمهارات الحياتية.
            3. لا تقتصر إجاباتك على محتوى الموقع فقط، بل كن موسوعة معرفية مفيدة للشباب.
            4. تحدث دائماً باللغة العربية.`,
      },
    });

    // If history is provided, we could reconstruct it here, but for now we send the message directly.
    const result = await chat.sendMessage({ message: message });
    const responseText = result.text;

    return res.status(200).json({ response: responseText });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to generate response" });
  }
}

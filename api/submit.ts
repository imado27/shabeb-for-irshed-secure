
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool } from './_db.js';
import { getClientIp } from './_utils.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID_MAIN = "@shabeb_for_irshed";
const CHAT_ID_CONTACT = "@shabeb_for_irshed_contact";

// وظيفة لتنظيف النص ومنع انكسار تنسيق HTML في تيليجرام
const escapeHTML = (text: string) => {
  if (!text) return "";
  return text
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Idempotency-Key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { data, uid } = req.body;
  const idempotencyKey = req.headers['idempotency-key'] as string;
  const now = Date.now();
  
  // 🔥 FIX: Use IP address as the secure identifier for Rate Limiting
  const userIp = getClientIp(req);

  if (!idempotencyKey || !data?.type) {
    return res.status(400).json({ error: 'بيانات الطلب غير مكتملة.' });
  }

  try {
    const db = getPool();

    // 1. Check Idempotency
    const idemCheck = await db.query('SELECT status FROM idempotency_keys WHERE key = $1', [idempotencyKey]);
    if (idemCheck.rows.length > 0 && idemCheck.rows[0].status === 'success') {
      return res.status(200).json({ success: true, cached: true });
    }

    // 2. Rate Limiting Check (Using IP)
    const cooldownPeriod = data.type === 'contact' ? 86400000 : 1800000;
    
    // Store/Check limit based on IP instead of client UID for better security
    const rateCheck = await db.query('SELECT timestamp FROM rate_limits WHERE uid = $1 AND type = $2', [userIp, data.type]);
    
    if (rateCheck.rows.length > 0) {
      const lastTime = parseInt(rateCheck.rows[0].timestamp);
      if (now - lastTime < cooldownPeriod) {
        const diff = cooldownPeriod - (now - lastTime);
        const waitMsg = data.type === 'contact' 
          ? `يمكنك الإرسال مرة أخرى بعد ${Math.ceil(diff / 3600000)} ساعة.` 
          : `يمكنك المحاولة مجدداً بعد ${Math.ceil(diff / 60000)} دقيقة.`;
        return res.status(429).json({ error: waitMsg });
      }
    }

    // Mark as processing
    await db.query(
      `INSERT INTO idempotency_keys (key, status, created_at) VALUES ($1, $2, $3) 
       ON CONFLICT (key) DO UPDATE SET status = 'processing', created_at = $3`,
      [idempotencyKey, 'processing', now]
    );

    // 3. Prepare Telegram Message
    let messageBody = "";
    const sep = "━━━━━━━━━━━━━━━━━━━━";

    if (data.type === 'register') {
      messageBody = `
<b>👤 طلب انخراط جديد (عضوية)</b>
${sep}
<b>📍 المعلومات الشخصية:</b>
• <b>الاسم:</b> ${escapeHTML(data.fullName)}
• <b>تاريخ الميلاد:</b> ${escapeHTML(data.birthDate)}
• <b>مكان الميلاد:</b> ${escapeHTML(data.birthPlace)}
• <b>الولاية:</b> ${escapeHTML(data.wilaya)}
• <b>العنوان:</b> ${escapeHTML(data.address)}

<b>📞 معلومات الاتصال:</b>
• <b>الهاتف:</b> <code>${escapeHTML(data.phone)}</code>
• <b>فيسبوك:</b> ${data.facebookLink ? `<a href="${data.facebookLink}">رابط الحساب</a>` : "<i>غير متوفر</i>"}

<b>🎓 المسار التعليمي:</b>
• <b>المستوى:</b> ${escapeHTML(data.educationLevel)}
• <b>التخصص:</b> ${escapeHTML(data.specialization)}

<b>🤝 التطوع والمساهمة:</b>
• <b>خبرة سابقة:</b> ${data.hasVolunteeredBefore === 'yes' ? "نعم" : "لا"}
${data.previousVolunteeringDetails ? `• <b>التفاصيل:</b> ${escapeHTML(data.previousVolunteeringDetails)}` : ""}
• <b>الخلية المختارة:</b> 
<i>${escapeHTML(data.selectedCell || "لم يتم التحديد")}</i>

<b>✅ الحالة:</b>
• <b>دفع الاشتراك:</b> ${data.agreesToFee ? "تمت الموافقة" : "لم يوافق"}
${sep}
#تسجيل_جديد #عضوية
`;
    } else {
      const subject = data.subject || "(بدون موضوع)";
      messageBody = `
<b>🔔 رسالة اتصال جديدة</b>
${sep}
<b>👤 المرسل:</b> ${escapeHTML(data.name)}
<b>📧 البريد:</b> <code>${escapeHTML(data.email)}</code>
<b>📌 الموضوع:</b> ${escapeHTML(subject)}

<b>📝 الرسالة:</b>
<i>${escapeHTML(data.message)}</i>

${sep}
#رسالة_تواصل #اتصال
`;
    }

    const targetChatId = data.type === 'register' ? CHAT_ID_MAIN : CHAT_ID_CONTACT;

    // Send to Telegram
    const telResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: targetChatId, 
        text: messageBody.trim(), 
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!telResponse.ok) throw new Error('Telegram Gateway Failed');

    // 4. Save to Database
    if (data.type === 'register') {
      // For registration records, we still save the UID sent by client if needed for tracking, or use IP
      // Keeping original UID logic for registration table to not break analytics, but rate limit uses IP
      await db.query(
        `INSERT INTO registrations (
          uid, full_name, birth_date, birth_place, address, wilaya, phone, facebook_link, 
          education_level, specialization, has_volunteered_before, previous_volunteering_details, 
          selected_cell, agrees_to_fee, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          uid, data.fullName, data.birthDate, data.birthPlace, data.address, data.wilaya, data.phone, data.facebookLink,
          data.educationLevel, data.specialization, data.hasVolunteeredBefore, data.previousVolunteeringDetails,
          data.selectedCell, data.agreesToFee, now
        ]
      );
    } 

    // 5. Update Rate Limits (Using IP) & Idempotency
    await db.query(
      `INSERT INTO rate_limits (uid, type, timestamp) VALUES ($1, $2, $3)
       ON CONFLICT (uid, type) DO UPDATE SET timestamp = $3`,
      [userIp, data.type, now]
    );

    await db.query(
      `UPDATE idempotency_keys SET status = 'success', completed_at = $1 WHERE key = $2`,
      [now, idempotencyKey]
    );

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'فشل في معالجة الطلب.' });
  }
}


import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { getPool } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { participant, responses, workshopTitle, isDynamic } = req.body;
  if (!responses || !participant) return res.status(400).json({ error: 'Data missing' });

  try {
    const db = getPool();

    // 1. جلب قائمة الإيميلات من Postgres
    const settingsRes = await db.query("SELECT value FROM settings WHERE key = 'evaluation_emails'");
    
    // قائمة المستلمين الافتراضية
    let recipients = ["madmadimado59@gmail.com", "imad@gmail.com", "hafsasenoussa@gmail.com"];
    
    if (settingsRes.rows.length > 0) {
      const dbEmails = settingsRes.rows[0].value;
      if (Array.isArray(dbEmails) && dbEmails.length > 0) {
        const dynamicEmails = dbEmails.filter((email: any) => typeof email === 'string' && email.includes('@'));
        recipients = Array.from(new Set([...recipients, ...dynamicEmails]));
      }
    }

    // 2. إعداد SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_APP_PASSWORD,
      },
    });

    // 3. تجهيز محتوى الرسالة
    let evaluationBody = "";

    if (isDynamic) {
        // تنسيق ديناميكي للورشات الجديدة
        evaluationBody = Object.entries(responses).map(([question, answer]) => `
            <div style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                <p style="margin: 0; color: #7e1d51; font-weight: bold; font-size: 14px;">${question}</p>
                <p style="margin: 5px 0 0 0; color: #333; font-size: 15px;">${answer || '---'}</p>
            </div>
        `).join('');
    } else {
        // التنسيق القديم (Hardcoded) للورشة رقم 1
        evaluationBody = `
          <p><b>1️⃣ الانطباع العام:</b> ${responses.q1}</p>
          <p><b>2️⃣ أكثر شيء أعجبك:</b><br/> ${responses.q2 || '---'}</p>
          <p><b>3️⃣ تقييم الأستاذ المحاضر:</b><br/>
            - وضوح الشرح: ${responses.q3_clarity}<br/>
            - التفاعل مع الحضور: ${responses.q3_interaction}<br/>
            - إيصال الفكرة: ${responses.q3_delivery}
          </p>
          <p><b>4️⃣ مدة الورشة:</b> ${responses.q4}</p>
          <p><b>5️⃣ نقاط ناقصة أو تحتاج إضافة:</b><br/> ${responses.q5 || '---'}</p>
          <p><b>7️⃣ التشجيع على الانخراط التطوعي:</b> ${responses.q7}</p>
        `;
    }

    const subjectLine = workshopTitle 
        ? `تقييم ورشة: ${workshopTitle} - ${participant.firstName} ${participant.lastName}`
        : `تقييم ورشة جديد: ${participant.firstName} ${participant.lastName}`;

    const htmlContent = `
      <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; line-height: 1.6; color: #333; border: 1px solid #7e1d51; padding: 25px; border-radius: 15px; background-color: #f9f9f9;">
        <h2 style="color: #7e1d51; text-align: center; border-bottom: 2px solid #7e1d51; padding-bottom: 10px;">${workshopTitle || 'نتائج تقييم ورشة العمل التطوعي'}</h2>
        
        <div style="background-color: #fff; padding: 15px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #7e1d51; margin-top: 0;">👤 بيانات المشارك</h3>
          <p><b>الاسم الكامل:</b> ${participant.firstName} ${participant.lastName}</p>
          <p><b>رقم الهاتف:</b> <span style="font-family: monospace;">${participant.phone}</span></p>
        </div>

        <div style="background-color: #fff; padding: 15px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #7e1d51; margin-top: 0;">📊 نتائج التقييم</h3>
          ${evaluationBody}
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;"/>
        <p style="font-size: 11px; color: #777; text-align: center;">تم الإرسال من منصة شباب فور إرشاد - الفريق البلدي - بلدية بن عبد المالك رمضان</p>
      </div>
    `;

    // 4. الإرسال
    await transporter.sendMail({
      from: `"منصة التقييم الذكية" <${process.env.SMTP_USER}>`,
      to: recipients.join(', '),
      subject: subjectLine,
      html: htmlContent,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Email API Error:", error);
    return res.status(500).json({ error: "فشل في إرسال البريد الإلكتروني." });
  }
}

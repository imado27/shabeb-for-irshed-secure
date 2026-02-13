
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool } from './_db.js';
import { hashPassword, verifyPassword, getClientIp } from './_utils.js';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'البيانات ناقصة' });

  const db = getPool();
  const ip = getClientIp(req);
  const now = Date.now();

  try {
    // 1. AUTO-SETUP / INITIAL BOOTSTRAP:
    // This logic only runs if the `admins` table is completely empty (first time run).
    const countRes = await db.query('SELECT count(*) FROM admins');
    
    if (parseInt(countRes.rows[0].count) === 0) {
      // 🔥 FIX: Strictly Use Environment Variables for Initial Admin Creds
      // No hardcoded passwords allowed here anymore.
      const initUser = process.env.ADMIN_INIT_USER || 'admin';
      const initPass = process.env.ADMIN_INIT_PASSWORD; 

      if (initPass && username === initUser && password === initPass) {
        const { hash, salt } = hashPassword(initPass);
        await db.query(
          'INSERT INTO admins (username, password_hash, salt) VALUES ($1, $2, $3)',
          [initUser, hash, salt]
        );
        // Continue to login...
      } else {
         // If env vars are not set or credentials don't match, block access.
         return res.status(401).json({ error: 'النظام غير مهيأ. يرجى ضبط متغيرات البيئة (ADMIN_INIT_PASSWORD).' });
      }
    }

    // 2. SECURITY: Check Rate Limits (Brute Force Protection)
    const attemptsRes = await db.query('SELECT * FROM login_attempts WHERE ip = $1', [ip]);
    if (attemptsRes.rows.length > 0) {
      const attempt = attemptsRes.rows[0];
      
      // If blocked
      if (attempt.blocked_until > now) {
        const remainingHours = Math.ceil((attempt.blocked_until - now) / 3600000);
        return res.status(403).json({ error: `تم حظر هذا الجهاز لدواعي أمنية. حاول بعد ${remainingHours} ساعة.` });
      }
      
      // Reset attempts if 15 minutes passed since last attempt
      if (now - attempt.last_attempt > 15 * 60 * 1000) {
         await db.query('UPDATE login_attempts SET attempts = 0 WHERE ip = $1', [ip]);
         attempt.attempts = 0;
      }
    }

    // 3. Verify Credentials from Database
    const userRes = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    
    let isAuthenticated = false;
    let adminId = null;

    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      if (verifyPassword(password, user.password_hash, user.salt)) {
        isAuthenticated = true;
        adminId = user.id;
      }
    }

    // 4. Handle Failure
    if (!isAuthenticated) {
      // Increment failed attempts
      const currentAttempts = (attemptsRes.rows[0]?.attempts || 0) + 1;
      let blockedUntil = 0;
      
      // Block for 48 hours if > 5 attempts
      if (currentAttempts >= 5) {
        blockedUntil = now + (48 * 60 * 60 * 1000); 
      }

      await db.query(
        `INSERT INTO login_attempts (ip, attempts, last_attempt, blocked_until) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (ip) DO UPDATE SET attempts = $2, last_attempt = $3, blocked_until = $4`,
        [ip, currentAttempts, now, blockedUntil]
      );

      if (blockedUntil > 0) {
        return res.status(403).json({ error: 'تم تجاوز الحد المسموح من المحاولات. تم الحظر لمدة 48 ساعة.' });
      }

      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    // 5. Handle Success
    // Reset login attempts
    await db.query('DELETE FROM login_attempts WHERE ip = $1', [ip]);

    // Generate Session Token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = now + (24 * 60 * 60 * 1000); // 24 Hours

    // Save Session
    await db.query(
      'INSERT INTO admin_sessions (token, admin_id, expires_at, ip_address) VALUES ($1, $2, $3, $4)',
      [token, adminId, expiresAt, ip]
    );

    return res.status(200).json({ success: true, token });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

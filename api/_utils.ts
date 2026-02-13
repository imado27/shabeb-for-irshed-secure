
import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getPool } from './_db.js';

// 1. Password Utilities
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// 2. IP Extraction
export function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

// 3. Session Middleware (The Gatekeeper)
export async function authenticateAdmin(req: VercelRequest): Promise<boolean> {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  const db = getPool();
  const now = Date.now();

  try {
    // Check if token exists and is not expired
    const result = await db.query(
      'SELECT admin_id FROM admin_sessions WHERE token = $1 AND expires_at > $2',
      [token, now]
    );

    if (result.rows.length > 0) {
      return true; // Valid Session
    }
    return false;
  } catch (error) {
    console.error("Auth Error:", error);
    return false;
  }
}

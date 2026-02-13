
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getPool();
  const { type } = req.query;

  if (req.method === 'GET') {
    if (type === 'registrations') {
      try {
        const result = await db.query('SELECT * FROM registrations ORDER BY timestamp DESC');
        const regs = result.rows.map(row => ({
            id: row.id.toString(),
            uid: row.uid,
            fullName: row.full_name,
            birthDate: row.birth_date,
            birthPlace: row.birth_place,
            address: row.address,
            wilaya: row.wilaya,
            phone: row.phone,
            facebookLink: row.facebook_link,
            educationLevel: row.education_level,
            specialization: row.specialization,
            hasVolunteeredBefore: row.has_volunteered_before,
            previousVolunteeringDetails: row.previous_volunteering_details,
            selectedCell: row.selected_cell,
            agreesToFee: row.agrees_to_fee,
            timestamp: parseInt(row.timestamp)
        }));
        return res.status(200).json(regs);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch registrations' });
      }
    } else if (type === 'settings') {
      try {
        const result = await db.query("SELECT value FROM settings WHERE key = 'evaluation_emails'");
        const emails = result.rows.length > 0 ? result.rows[0].value : ["madmadimado59@gmail.com", "imad@gmail.com"];
        return res.status(200).json(emails);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch settings' });
      }
    }
  }

  if (req.method === 'POST') {
    if (type === 'settings') {
        const { emails } = req.body;
        try {
            await db.query(
                `INSERT INTO settings (key, value) VALUES ('evaluation_emails', $1)
                 ON CONFLICT (key) DO UPDATE SET value = $1`,
                [JSON.stringify(emails)]
            );
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update settings' });
        }
    }
  }

  return res.status(400).json({ error: 'Invalid Request' });
}


import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing ID' });

  try {
    const db = getPool();
    const result = await db.query('SELECT * FROM workshops WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    const workshop = result.rows[0];
    return res.status(200).json({
      id: workshop.id,
      title: workshop.title,
      instructor: workshop.instructor,
      heroImage: workshop.hero_image,
      questions: workshop.questions // Postgres JSONB returns object directly
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
}


import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getPool();

  if (req.method === 'GET') {
    try {
      const result = await db.query('SELECT * FROM news ORDER BY date DESC, created_at DESC');
      // Convert media_urls array to proper structure if needed by frontend or ensure it matches
      const news = result.rows.map(row => ({
        id: row.id.toString(),
        title: row.title,
        date: row.date,
        category: row.category,
        description: row.description,
        imageUrl: row.image_url,
        videoUrl: row.video_url,
        mediaUrls: row.media_urls || []
      }));
      return res.status(200).json(news);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch news' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, date, category, description, mediaUrls, imageUrl, videoUrl } = req.body;
      
      const result = await db.query(
        `INSERT INTO news (title, date, category, description, image_url, video_url, media_urls)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [title, date, category, description, imageUrl, videoUrl, mediaUrls]
      );
      
      return res.status(200).json({ success: true, id: result.rows[0].id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to add news' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      
      await db.query('DELETE FROM news WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete news' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

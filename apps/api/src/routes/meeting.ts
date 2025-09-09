import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const schema = z.object({ bookingId: z.string().uuid(), provider: z.enum(['zoom', 'google_meet']).default('zoom') });

router.post('/', async (req, res) => {
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { bookingId, provider } = parse.data;
  // Stub meeting link generation; replace with real API integration
  const joinUrl = `https://example.com/meet/${provider}/${bookingId}`;
  const hostUrl = `https://example.com/host/${provider}/${bookingId}`;
  res.status(201).json({ bookingId, provider, joinUrl, hostUrl });
});

export default router;



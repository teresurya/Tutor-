import { Router } from 'express';
import { z } from 'zod';
import { Booking } from '../models/Booking';

const router = Router();

const createSchema = z.object({
  studentId: z.string().uuid(),
  tutorId: z.string().uuid(),
  subjectId: z.string().uuid(),
  mode: z.enum(['online', 'in_person']),
  startAt: z.string(),
  endAt: z.string()
});

router.post('/', async (req, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const booking = await Booking.create({ ...parse.data, startAt: new Date(parse.data.startAt), endAt: new Date(parse.data.endAt) });
  res.status(201).json(booking);
});

router.get('/:id', async (req, res) => {
  const b = await Booking.findByPk(req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  res.json(b);
});

export default router;



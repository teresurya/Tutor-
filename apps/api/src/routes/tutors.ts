import { Router } from 'express';
import { z } from 'zod';
import { TutorProfile } from '../models/TutorProfile';
import { Subject } from '../models/Subject';
import { TutorSubject } from '../models/TutorSubject';

const router = Router();

router.get('/:id', async (req, res) => {
  const tutor = await TutorProfile.findByPk(req.params.id);
  if (!tutor) return res.status(404).json({ error: 'Not found' });
  res.json(tutor);
});

router.get('/', async ( _req, res) => {
  const tutors = await TutorProfile.findAll({ where: { approvalStatus: 'approved' } });
  res.json(tutors);
});

const createSchema = z.object({ userId: z.string().uuid(), bio: z.string().optional(), hourlyRate: z.number().optional() });
router.post('/', async (req, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const tutor = await TutorProfile.create({ ...parse.data, approvalStatus: 'pending' });
  res.status(201).json(tutor);
});

export default router;



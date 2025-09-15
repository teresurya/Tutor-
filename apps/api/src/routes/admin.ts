import { Router } from 'express';
import { TutorProfile } from '../models/TutorProfile';

const router = Router();

router.post('/tutors/:id/approve', async (req, res) => {
  const tutor = await TutorProfile.findByPk(req.params.id);
  if (!tutor) return res.status(404).json({ error: 'Not found' });
  tutor.approvalStatus = 'approved';
  await tutor.save();
  res.json(tutor);
});

export default router;



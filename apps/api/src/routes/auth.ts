import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env';
import { User } from '../models/User';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['student', 'parent', 'tutor'])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/register', async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { name, email, password, role } = parse.data;
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: role as any });
  return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

router.post('/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password } = parse.data;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: '1h' });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

export default router;



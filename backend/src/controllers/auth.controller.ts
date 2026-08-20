import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendRegisterEmail } from '../utils/mailer';
import { JWT_SECRET } from '../config';

const RegisterSchema = z.object({
  email: z.string().email('Érvénytelen email formátum'),
  password: z.string().min(6, 'A jelszónak legalább 6 karakterből kell állnia'),
  name: z.string().min(2, 'A név legalább 2 karakter legyen'),
});

const LoginSchema = z.object({
  email: z.string().email('Érvénytelen email formátum'),
  password: z.string().min(1, 'A jelszó megadása kötelező'),
});

export async function register(req: Request, res: Response) {
  const validation = RegisterSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }

  const { email, password, name } = validation.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Ezzel az email címmel már regisztráltak' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, name, password: hashedPassword },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    await sendRegisterEmail(newUser.email, newUser.name);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Regisztrációs hiba:', error);
    res.status(500).json({ error: 'Szerver hiba a regisztráció során' });
  }
}

export async function login(req: Request, res: Response) {
  const validation = LoginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }

  const { email, password } = validation.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Érvénytelen email vagy jelszó' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Érvénytelen email vagy jelszó' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error('Bejelentkezési hiba:', error);
    res.status(500).json({ error: 'Szerver hiba a bejelentkezés során' });
  }
}

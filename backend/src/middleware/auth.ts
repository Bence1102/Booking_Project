import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Hiányzó vagy érvénytelen token' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    next();
  } catch {
    return res.status(401).json({ error: 'Érvénytelen vagy lejárt token' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Nincs jogosultságod ehhez a művelethez' });
  }
  next();
}

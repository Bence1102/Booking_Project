import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const ReviewSchema = z.object({
  rating: z.number().int().min(1, 'Az értékelés 1 és 5 között legyen').max(5, 'Az értékelés 1 és 5 között legyen'),
  comment: z.string().max(1000).optional(),
});

export async function listReviews(req: Request, res: Response) {
  try {
    const reviews = await prisma.review.findMany({
      where: { resourceId: req.params.resourceId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Hiba a vélemények lekérésekor:', error);
    res.status(500).json({ error: 'Szerver hiba a vélemények lekérésekor' });
  }
}

export async function upsertReview(req: Request, res: Response) {
  const validation = ReviewSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }

  const resourceId = req.params.resourceId as string;
  const { rating, comment } = validation.data;
  const userId = req.user!.userId;

  try {
    const hasBooking = await prisma.booking.findFirst({ where: { resourceId, userId } });
    if (!hasBooking) {
      return res.status(403).json({ error: 'Csak olyan erőforrást értékelhetsz, amit már lefoglaltál' });
    }

    const review = await prisma.review.upsert({
      where: { userId_resourceId: { userId, resourceId } },
      create: { userId, resourceId, rating, comment },
      update: { rating, comment },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Hiba a vélemény mentésekor:', error);
    res.status(500).json({ error: 'Szerver hiba a vélemény mentésekor' });
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    await prisma.review.deleteMany({
      where: { resourceId: req.params.resourceId, userId: req.user!.userId },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Hiba a vélemény törlésekor:', error);
    res.status(500).json({ error: 'Szerver hiba a vélemény törlésekor' });
  }
}

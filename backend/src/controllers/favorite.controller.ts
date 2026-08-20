import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { withRating } from '../utils/rating';

export async function listFavorites(req: Request, res: Response) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      include: { resource: { include: { reviews: { select: { rating: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(favorites.map((f) => ({ ...f, resource: withRating(f.resource) })));
  } catch (error) {
    console.error('Hiba a kedvencek lekérésekor:', error);
    res.status(500).json({ error: 'Szerver hiba a kedvencek lekérésekor' });
  }
}

export async function addFavorite(req: Request, res: Response) {
  try {
    const { resourceId } = req.body;
    if (!resourceId) {
      return res.status(400).json({ error: 'Az erőforrás azonosítója kötelező' });
    }

    const userId = req.user!.userId;

    const favorite = await prisma.favorite.upsert({
      where: { userId_resourceId: { userId, resourceId } },
      create: { userId, resourceId },
      update: {},
      include: { resource: true },
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Hiba a kedvencekhez adáskor:', error);
    res.status(500).json({ error: 'Szerver hiba a kedvencekhez adáskor' });
  }
}

export async function removeFavorite(req: Request, res: Response) {
  try {
    await prisma.favorite.deleteMany({
      where: { userId: req.user!.userId, resourceId: req.params.resourceId },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Hiba a kedvenc törlésekor:', error);
    res.status(500).json({ error: 'Szerver hiba a kedvenc törlésekor' });
  }
}

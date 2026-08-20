import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { withRating } from '../utils/rating';

export async function listResources(req: Request, res: Response) {
  try {
    const resources = await prisma.resource.findMany({
      include: { reviews: { select: { rating: true } } },
    });
    res.json(resources.map(withRating));
  } catch (error) {
    console.error('Hiba a lekérés során:', error);
    res.status(500).json({ error: 'Szerver hiba az adatok lekérésekor' });
  }
}

export async function getResource(req: Request, res: Response) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: req.params.id },
      include: { reviews: { select: { rating: true } } },
    });
    if (!resource) {
      return res.status(404).json({ error: 'Erőforrás nem található' });
    }
    res.json(withRating(resource));
  } catch (error) {
    res.status(500).json({ error: 'Szerver hiba a lekéréskor' });
  }
}

export async function createResource(req: Request, res: Response) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'A név megadása kötelező' });
    }

    const newResource = await prisma.resource.create({ data: { name, description } });
    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ error: 'Szerver hiba a létrehozáskor' });
  }
}

export async function deleteResource(req: Request, res: Response) {
  try {
    await prisma.resource.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Szerver hiba a törléskor' });
  }
}

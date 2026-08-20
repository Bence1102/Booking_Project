import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendBookingEmail } from '../utils/mailer';

const BookingSchema = z.object({
  resourceId: z.string().uuid('Érvénytelen erőforrás azonosító (UUID szükséges)'),
  startTime: z.string().datetime('Érvénytelen kezdési dátum formátum (ISO string szükséges)'),
  endTime: z.string().datetime('Érvénytelen befejezési dátum formátum (ISO string szükséges)'),
});

export async function listBookings(req: Request, res: Response) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        resource: true,
        user: { select: { id: true, name: true } },
      },
      orderBy: { startTime: 'asc' },
    });
    res.json(bookings);
  } catch (error) {
    console.error('Hiba a foglalások lekérésekor:', error);
    res.status(500).json({ error: 'Szerver hiba a foglalások lekérésekor' });
  }
}

export async function createBooking(req: Request, res: Response) {
  const validation = BookingSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }

  const { resourceId, startTime, endTime } = validation.data;
  const userId = req.user!.userId;

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    return res.status(400).json({ error: 'A kezdési időpontnak korábban kell lennie, mint a befejezési időpont' });
  }

  if (start < new Date()) {
    return res.status(400).json({ error: 'Múltbéli időpontra nem hozható létre foglalás!' });
  }

  try {
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        resourceId,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (conflictingBooking) {
      return res.status(409).json({ error: 'A kiválasztott időpontban az erőforrás már foglalt!' });
    }

    const newBooking = await prisma.booking.create({
      data: { resourceId, userId, startTime: start, endTime: end },
      include: {
        resource: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await sendBookingEmail(newBooking.user.email, newBooking.resource.name, start, end);

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Hiba a foglalás létrehozásakor:', error);
    res.status(500).json({ error: 'Szerver hiba a foglalás során' });
  }
}

export async function deleteBooking(req: Request, res: Response) {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) {
      return res.status(404).json({ error: 'Foglalás nem található' });
    }

    if (booking.userId !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Csak a saját foglalásodat törölheted' });
    }

    await prisma.booking.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Szerver hiba a foglalás törlésekor' });
  }
}

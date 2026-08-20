import { Router } from 'express';
import { listBookings, createBooking, deleteBooking } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', listBookings);
router.post('/', createBooking);
router.delete('/:id', deleteBooking);

export default router;

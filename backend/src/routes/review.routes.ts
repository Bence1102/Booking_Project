import { Router } from 'express';
import { listReviews, upsertReview, deleteReview } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.get('/', listReviews);
router.post('/', authenticate, upsertReview);
router.delete('/', authenticate, deleteReview);

export default router;

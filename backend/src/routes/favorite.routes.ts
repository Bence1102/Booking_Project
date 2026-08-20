import { Router } from 'express';
import { listFavorites, addFavorite, removeFavorite } from '../controllers/favorite.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', listFavorites);
router.post('/', addFavorite);
router.delete('/:resourceId', removeFavorite);

export default router;

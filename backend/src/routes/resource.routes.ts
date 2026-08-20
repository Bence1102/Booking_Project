import { Router } from 'express';
import {
  listResources,
  getResource,
  createResource,
  deleteResource,
} from '../controllers/resource.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', listResources);
router.get('/:id', getResource);
router.post('/', authenticate, requireAdmin, createResource);
router.delete('/:id', authenticate, requireAdmin, deleteResource);

export default router;

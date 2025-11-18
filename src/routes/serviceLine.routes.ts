import { Router } from 'express';
import {
  createServiceLine,
  getAllServiceLines,
  getServiceLineById,
  updateServiceLine,
  deleteServiceLine,
  createServiceLineSchema,
  updateServiceLineSchema,
} from '../controllers/serviceLine.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createServiceLineSchema), authorize('ADMIN', 'MANAGER'), createServiceLine);
router.get('/', getAllServiceLines);
router.get('/:id', getServiceLineById);
router.put('/:id', validate(updateServiceLineSchema), authorize('ADMIN', 'MANAGER'), updateServiceLine);
router.delete('/:id', authorize('ADMIN'), deleteServiceLine);

export default router;

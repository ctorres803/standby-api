import { Router } from 'express';
import {
  createSpecialty,
  getAllSpecialties,
  getSpecialtyById,
  updateSpecialty,
  deleteSpecialty,
  createSpecialtySchema,
  updateSpecialtySchema,
} from '../controllers/specialty.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createSpecialtySchema), authorize('ADMIN', 'MANAGER'), createSpecialty);
router.get('/', getAllSpecialties);
router.get('/:id', getSpecialtyById);
router.put('/:id', validate(updateSpecialtySchema), authorize('ADMIN', 'MANAGER'), updateSpecialty);
router.delete('/:id', authorize('ADMIN'), deleteSpecialty);

export default router;

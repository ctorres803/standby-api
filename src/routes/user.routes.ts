import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  updateUserSchema,
  changePasswordSchema,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', validate(updateUserSchema), authorize('ADMIN', 'MANAGER'), updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);
router.post('/change-password', validate(changePasswordSchema), changePassword);

export default router;

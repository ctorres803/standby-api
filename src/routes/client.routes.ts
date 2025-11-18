import { Router } from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  createClientSchema,
  updateClientSchema,
} from '../controllers/client.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createClientSchema), authorize('ADMIN', 'MANAGER'), createClient);
router.get('/', getAllClients);
router.get('/:id', getClientById);
router.put('/:id', validate(updateClientSchema), authorize('ADMIN', 'MANAGER'), updateClient);
router.delete('/:id', authorize('ADMIN'), deleteClient);

export default router;

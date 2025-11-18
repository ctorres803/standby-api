import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import serviceLineRoutes from './serviceLine.routes';
import specialtyRoutes from './specialty.routes';
import clientRoutes from './client.routes';
import teamRoutes from './team.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/service-lines', serviceLineRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/clients', clientRoutes);
router.use('/teams', teamRoutes);

export default router;

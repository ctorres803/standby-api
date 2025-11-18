import { Router } from 'express';
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  assignServiceLine,
  removeServiceLine,
  assignSpecialty,
  removeSpecialty,
  assignClient,
  removeClient,
  createTeamSchema,
  updateTeamSchema,
  addMemberSchema,
  assignServiceLineSchema,
  assignSpecialtySchema,
  assignClientSchema,
} from '../controllers/team.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Base CRUD operations
router.post('/', validate(createTeamSchema), authorize('ADMIN', 'MANAGER'), createTeam);
router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.put('/:id', validate(updateTeamSchema), authorize('ADMIN', 'MANAGER'), updateTeam);
router.delete('/:id', authorize('ADMIN'), deleteTeam);

// Team members management
router.post('/:id/members', validate(addMemberSchema), authorize('ADMIN', 'MANAGER'), addTeamMember);
router.delete('/:id/members/:userId', authorize('ADMIN', 'MANAGER'), removeTeamMember);

// Service lines management
router.post('/:id/service-lines', validate(assignServiceLineSchema), authorize('ADMIN', 'MANAGER'), assignServiceLine);
router.delete('/:id/service-lines/:serviceLineId', authorize('ADMIN', 'MANAGER'), removeServiceLine);

// Specialties management
router.post('/:id/specialties', validate(assignSpecialtySchema), authorize('ADMIN', 'MANAGER'), assignSpecialty);
router.delete('/:id/specialties/:specialtyId', authorize('ADMIN', 'MANAGER'), removeSpecialty);

// Clients management
router.post('/:id/clients', validate(assignClientSchema), authorize('ADMIN', 'MANAGER'), assignClient);
router.delete('/:id/clients/:clientId', authorize('ADMIN', 'MANAGER'), removeClient);

export default router;

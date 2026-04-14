import { Router } from 'express';
import {
  createAssignment,
  listAssignments,
  assignmentValidators,
} from '../controllers/assignmentController.js';
import { handleValidationErrors } from '../middleware/validate.js';

const router = Router();

router.post('/', assignmentValidators.create, handleValidationErrors, createAssignment);
router.get('/', listAssignments);

export default router;

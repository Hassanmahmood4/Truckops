import { Router } from 'express';
import { createLoad, listLoads, updateLoad, loadValidators } from '../controllers/loadController.js';
import { handleValidationErrors } from '../middleware/validate.js';

const router = Router();

router.post('/', loadValidators.create, handleValidationErrors, createLoad);
router.get('/', listLoads);
router.put('/:id', loadValidators.update, handleValidationErrors, updateLoad);

export default router;

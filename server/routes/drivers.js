import { Router } from 'express';
import {
  createDriver,
  listDrivers,
  updateDriver,
  deleteDriver,
  driverValidators,
} from '../controllers/driverController.js';
import { handleValidationErrors } from '../middleware/validate.js';

const router = Router();

router.post('/', driverValidators.create, handleValidationErrors, createDriver);
router.get('/', listDrivers);
router.put('/:id', driverValidators.update, handleValidationErrors, updateDriver);
router.delete('/:id', driverValidators.idParam, handleValidationErrors, deleteDriver);

export default router;

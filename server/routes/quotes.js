import { Router } from 'express';
import { createQuote, listQuotes, quoteValidators } from '../controllers/quoteController.js';
import { handleValidationErrors } from '../middleware/validate.js';

const router = Router();

router.post('/', quoteValidators.create, handleValidationErrors, createQuote);
router.get('/', listQuotes);

export default router;

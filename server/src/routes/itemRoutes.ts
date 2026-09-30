import { Router } from 'express';
import { getItems, getItemById, createItem } from '../controllers/itemController';
import { validateBody } from '../middleware/validate';
import { CreateItemSchema } from '../services/validation';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', validateBody(CreateItemSchema), createItem);

export default router;

import { Router } from 'express';
import { getItems, getItemById, createItem, getMyItems } from '../controllers/itemController';
import { requireAuth, loadSessionUser } from '../middleware/auth';

const router = Router();

router.use(loadSessionUser);

router.get('/', getItems);
router.get('/mine', requireAuth, getMyItems);
router.get('/:id', getItemById);
router.post('/', requireAuth, createItem);

export default router;

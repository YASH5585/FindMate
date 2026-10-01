import { Router } from 'express';
import {
  createContactRequest,
  getContactRequests,
  getContactRequest,
  updateContactRequest,
} from '../controllers/contactRequestController';
import { requireAuth, loadSessionUser } from '../middleware/auth';

const router = Router();

router.use(loadSessionUser);

router.get('/', requireAuth, getContactRequests);
router.post('/', requireAuth, createContactRequest);
router.get('/:id', requireAuth, getContactRequest);
router.patch('/:id', requireAuth, updateContactRequest);

export default router;

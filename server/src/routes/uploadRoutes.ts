import { Router } from 'express';
import multer from 'multer';
import { uploadImage, handleMulterError } from '../controllers/uploadController';
import { requireAuth, loadSessionUser } from '../middleware/auth';

const router = Router();

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please use JPG, PNG, WebP, or GIF.'));
    }
  },
});

router.use(loadSessionUser);

router.post('/image', requireAuth, upload.single('image'), uploadImage);

router.use(handleMulterError);

export default router;

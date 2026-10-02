import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadImage(req: Request, res: Response, next: NextFunction): void {
  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinary) {
    next(new AppError('Image uploads are not configured.', 501));
    return;
  }

  if (!req.file) {
    next(new AppError('No file provided.', 400));
    return;
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'findmate', resource_type: 'image' },
    (
      error: Error | undefined,
      result: UploadApiResponse | undefined
    ) => {
      if (error || !result) {
        next(new AppError('Failed to upload image to object storage.', 502));
        return;
      }
      res.status(201).json({ url: result.secure_url });
    }
  );

  req.file.stream.pipe(uploadStream);
}

export function handleMulterError(err: Error, _req: Request, res: Response, next: NextFunction): void {
  if (err && typeof err === 'object' && 'code' in err) {
    const multerErr = err as { code: string };
    if (multerErr.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ error: 'File size exceeds 5MB limit.', message: 'File size exceeds 5MB limit.' });
      return;
    }
    res.status(400).json({ error: 'File upload error.', message: 'Invalid file upload.' });
    return;
  }
  if (err.message && err.message.includes('Unsupported file type')) {
    res.status(400).json({ error: 'Unsupported file type.', message: err.message });
    return;
  }
  next(err);
}

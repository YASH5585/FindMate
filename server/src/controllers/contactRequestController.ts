import { Request, Response, NextFunction } from 'express';
import * as contactRequestService from '../services/contactRequestService';
import {
  CreateContactRequestSchema,
  ContactRequestIdSchema,
  UpdateContactRequestSchema,
} from '../services/validation';
import { AppError } from '../middleware/errorHandler';

export const createContactRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    const body = CreateContactRequestSchema.safeParse(req.body);
    if (!body.success) {
      const message = body.error.issues[0]?.message ?? 'Validation failed';
      throw new AppError(message, 400);
    }
    try {
      const request = await contactRequestService.createContactRequest(req.user.id, body.data);
      res.status(201).json(request);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create contact request';
      if (message === 'Item not found') {
        throw new AppError('Item not found', 404);
      }
      if (message === 'Cannot contact yourself') {
        throw new AppError('Cannot contact yourself', 400);
      }
      if (message === 'Duplicate request') {
        throw new AppError('A pending contact request already exists for this item', 409);
      }
      throw new AppError(message, 400);
    }
  } catch (err) {
    next(err);
  }
};

export const getContactRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    const requests = await contactRequestService.getContactRequestsForUser(req.user.id);
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

export const getContactRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    const parsed = ContactRequestIdSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new AppError('Invalid contact request id', 400);
    }
    const request = await contactRequestService.getContactRequestById(parsed.data.id, req.user.id);
    if (!request) {
      throw new AppError('Contact request not found', 404);
    }
    res.json(request);
  } catch (err) {
    next(err);
  }
};

export const updateContactRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    const idParams = ContactRequestIdSchema.safeParse(req.params);
    const statusBody = UpdateContactRequestSchema.safeParse(req.body);
    if (!idParams.success || !statusBody.success) {
      throw new AppError('Invalid request', 400);
    }
    try {
      const request = await contactRequestService.updateContactRequest(
        idParams.data.id,
        req.user.id,
        statusBody.data.status
      );
      if (!request) {
        throw new AppError('Contact request not found', 404);
      }
      res.json(request);
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : 'Failed to update contact request';
      if (message === 'Unauthorized') {
        throw new AppError('Contact request not found', 404);
      }
      throw new AppError(message, 400);
    }
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from 'express';
import * as itemService from '../services/itemService';
import { CreateItemSchema, ItemIdSchema, ItemFiltersSchema } from '../services/validation';
import { AppError } from '../middleware/errorHandler';
import type { Item } from '../types/item';

export const getItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters = ItemFiltersSchema.safeParse(req.query);
    if (!filters.success) {
      throw new AppError('Invalid query parameters', 400);
    }
    const items = await itemService.getItems(filters.data);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const getMyItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    const filters = ItemFiltersSchema.safeParse(req.query);
    if (!filters.success) {
      throw new AppError('Invalid query parameters', 400);
    }
    const items = await itemService.getItemsByUser(req.user.id, filters.data);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const getItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = ItemIdSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new AppError('Invalid item id', 400);
    }
    const item = await itemService.getItemById(parsed.data.id);
    if (!item) {
      throw new AppError('Item not found', 404);
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const createItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    const body = CreateItemSchema.safeParse(req.body);
    if (!body.success) {
      const message = body.error.issues[0]?.message ?? 'Validation failed';
      throw new AppError(message, 400);
    }
    const itemData = body.data;
    const item: Item = await itemService.createItem({
      ...itemData,
      userId: req.user.id,
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

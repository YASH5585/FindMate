import type { Item } from '@/types/item';
import { mockItems } from '@/data/mockItems';

export const getItemById = (id: string): Item | undefined =>
  mockItems.find((item) => item.id === id);

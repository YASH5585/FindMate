export type ItemStatus = 'lost' | 'found';
export type ItemCategory = 'electronics' | 'id-card' | 'bags' | 'books' | 'accessories' | 'clothing' | 'other';
export type ItemLocation = 'library' | 'cafeteria' | 'academic-block' | 'sports-complex' | 'hostel' | 'parking-area' | 'other';

export interface Item {
  id: string;
  name: string;
  status: ItemStatus;
  category: ItemCategory;
  description: string;
  location: ItemLocation;
  date: string;
  image?: string;
  reporterName: string;
  contact: string;
  createdAt: string;
}

export type ReportMode = 'lost' | 'found';

export interface ReportFormData {
  name: string;
  category: ItemCategory;
  description: string;
  location: ItemLocation;
  date: string;
  image?: File;
  imagePreview?: string;
  contact: string;
}

export interface ReportFormErrors {
  name?: string;
  category?: string;
  description?: string;
  location?: string;
  date?: string;
  image?: string;
  contact?: string;
  submit?: string;
  imagePreview?: string;
}

export interface ReportSubmitResult {
  success: boolean;
  item?: Item;
  error?: string;
}
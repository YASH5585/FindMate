import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { ReportFormField } from './ReportFormField';
import { ImageUpload } from './ImageUpload';
import { CharacterCounter } from './CharacterCounter';
import { ReportSuccess } from './ReportSuccess';
import { cn } from '@/lib/utils';
import type { ReportFormData, ReportFormErrors, ReportMode, ReportSubmitResult } from '@/types/report';

const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'id-card', label: 'ID / Cards' },
  { value: 'bags', label: 'Bags' },
  { value: 'books', label: 'Books' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'other', label: 'Other' },
] as const;

const LOCATIONS = [
  { value: 'library', label: 'Library' },
  { value: 'cafeteria', label: 'Cafeteria' },
  { value: 'academic-block', label: 'Academic Block' },
  { value: 'sports-complex', label: 'Sports Complex' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'parking-area', label: 'Parking Area' },
  { value: 'other', label: 'Other' },
] as const;

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

interface ReportFormProps {
  mode: ReportMode;
  onSubmit: (data: ReportFormData) => Promise<ReportSubmitResult>;
}

const initialFormData: ReportFormData = {
  name: '',
  category: 'electronics',
  description: '',
  location: 'library',
  date: '',
  image: undefined,
  imagePreview: undefined,
  contact: '',
};

const initialErrors: ReportFormErrors = {};

export const ReportForm = ({ mode, onSubmit }: ReportFormProps) => {
  const [formData, setFormData] = useState<ReportFormData>(initialFormData);
  const [errors, setErrors] = useState<ReportFormErrors>(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const firstErrorRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Reset form when mode changes
  useEffect(() => {
    setFormData(initialFormData);
    setErrors(initialErrors);
    setIsSuccess(false);
    setTouched({});
  }, [mode]);

  // Focus first error on submit attempt
  useEffect(() => {
    if (isSubmitting && firstErrorRef.current) {
      firstErrorRef.current.focus();
      firstErrorRef.current = null;
    }
  }, [isSubmitting]);

  const getStringValue = (value: ReportFormData[keyof ReportFormData]): string => {
    return typeof value === 'string' ? value.trim() : '';
  };

  const validateField = (name: keyof ReportFormData, value: ReportFormData[keyof ReportFormData]): string | undefined => {
    const stringValue = typeof value === 'string' ? value.trim() : '';

    switch (name) {
      case 'name':
        if (!stringValue) return 'Item name is required.';
        if (stringValue.length < 2) return 'Item name must be at least 2 characters.';
        return undefined;
      case 'category':
        if (!value || value === 'all') return 'Please select a category.';
        return undefined;
      case 'description':
        if (!stringValue) return 'Please describe the item.';
        if (stringValue.length < 10) return 'Description must be at least 10 characters.';
        if (stringValue.length > 500) return 'Description must not exceed 500 characters.';
        return undefined;
      case 'location':
        if (!value || value === 'all') return 'Please select where it was lost.';
        return undefined;
      case 'date':
        if (!value) return 'Please select the date.';
        if (new Date(value) > new Date()) return 'Date cannot be in the future.';
        return undefined;
      case 'contact':
        if (!stringValue) return 'Contact email is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stringValue)) return 'Please enter a valid email address.';
        return undefined;
      case 'image':
        if (value instanceof File) {
          if (!ACCEPTED_IMAGE_TYPES.includes(value.type)) {
            return 'Unsupported file type. Please use JPG, PNG, WebP, or GIF.';
          }
          if (value.size > 5 * 1024 * 1024) {
            return 'File size exceeds 5MB limit.';
          }
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    let firstErrorField: keyof ReportFormData | null = null;

    (Object.keys(formData) as Array<keyof ReportFormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        if (!firstErrorField) firstErrorField = key;
      }
    });

    setErrors(newErrors as ReportFormErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (firstErrorField) {
      setTimeout(() => {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.focus();
        }
      }, 0);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: keyof ReportFormData, value: ReportFormData[keyof ReportFormData]) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name: keyof ReportFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image: file ?? undefined }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, imagePreview: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, imagePreview: undefined }));
    }
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateAll()) {
      try {
        const result = await onSubmit(formData);
        if (result.success) {
          setIsSuccess(true);
        } else {
          setErrors(prev => ({ ...prev, submit: result.error }));
        }
      } catch {
        setErrors(prev => ({ ...prev, submit: 'Something went wrong. Please try again.' }));
      }
    }
    setIsSubmitting(false);
  };

  const handleReportAnother = () => {
    setFormData(initialFormData);
    setErrors(initialErrors);
    setIsSuccess(false);
    setTouched({});
  };

  const handleViewReports = () => {
    window.location.href = '/browse';
  };

  if (isSuccess) {
    return <ReportSuccess mode={mode} onReportAnother={handleReportAnother} onViewReports={handleViewReports} />;
  }

  const isLost = mode === 'lost';
  const dateLabel = isLost ? 'Date Lost' : 'Date Found';
  const datePlaceholder = isLost ? 'When did you lose it?' : 'When did you find it?';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-8" noValidate>
      <div className="space-y-6">
        <ReportFormField label="Item Name" htmlFor="name" required error={touched.name ? errors.name : undefined}>
          <input
            ref={el => { if (!firstErrorRef.current && touched.name && errors.name) firstErrorRef.current = el; }}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={cn(
              'w-full px-4 py-3 text-base',
              'bg-white border border-black/10 rounded-card',
              'focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand',
              'transition-colors duration-150 ease-out',
              touched.name && errors.name && 'border-brand focus:border-brand focus:ring-brand'
            )}
            placeholder="e.g., Black Wallet"
            aria-invalid={touched.name && !!errors.name}
            aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
            disabled={isSubmitting}
          />
        </ReportFormField>

        <ReportFormField label="Category" htmlFor="category" required error={touched.category ? errors.category : undefined}>
          <select
            ref={el => { if (!firstErrorRef.current && touched.category && errors.category) firstErrorRef.current = el; }}
            id="category"
            name="category"
            value={formData.category}
            onChange={e => handleChange('category', e.target.value as typeof formData.category)}
            onBlur={() => handleBlur('category')}
            className={cn(
              'w-full px-4 py-3 text-base appearance-none',
              'bg-white border border-black/10 rounded-card',
              'focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand',
              'transition-colors duration-150 ease-out',
              'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23606060%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%27")] bg-right-3 bg-center pr-10 bg-no-repeat',
              touched.category && errors.category && 'border-brand focus:border-brand focus:ring-brand'
            )}
            aria-invalid={touched.category && !!errors.category}
            aria-describedby={touched.category && errors.category ? 'category-error' : undefined}
            disabled={isSubmitting}
          >
            <option value="">Select category</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </ReportFormField>

        <ReportFormField label="Description" htmlFor="description" required error={touched.description ? errors.description : undefined} hint={`${Math.min(formData.description.length, 500)} / 500 characters`}>
          <div className="relative">
            <textarea
              ref={el => { if (!firstErrorRef.current && touched.description && errors.description) firstErrorRef.current = el; }}
              id="description"
              name="description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              rows={5}
              maxLength={500}
              className={cn(
                'w-full px-4 py-3 text-base resize-none',
                'bg-white border border-black/10 rounded-card',
                'focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand',
                'transition-colors duration-150 ease-out',
                touched.description && errors.description && 'border-brand focus:border-brand focus:ring-brand'
              )}
              placeholder="Describe the item in detail (color, brand, unique marks, contents, etc.)"
              aria-invalid={touched.description && !!errors.description}
              aria-describedby={touched.description && errors.description ? 'description-error' : 'description-hint'}
              disabled={isSubmitting}
            />
            <CharacterCounter current={formData.description.length} max={500} />
          </div>
        </ReportFormField>

        <ReportFormField label="Location" htmlFor="location" required error={touched.location ? errors.location : undefined}>
          <select
            ref={el => { if (!firstErrorRef.current && touched.location && errors.location) firstErrorRef.current = el; }}
            id="location"
            name="location"
            value={formData.location}
            onChange={e => handleChange('location', e.target.value as typeof formData.location)}
            onBlur={() => handleBlur('location')}
            className={cn(
              'w-full px-4 py-3 text-base appearance-none',
              'bg-white border border-black/10 rounded-card',
              'focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand',
              'transition-colors duration-150 ease-out',
              'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23606060%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%27")] bg-right-3 bg-center pr-10 bg-no-repeat',
              touched.location && errors.location && 'border-brand focus:border-brand focus:ring-brand'
            )}
            aria-invalid={touched.location && !!errors.location}
            aria-describedby={touched.location && errors.location ? 'location-error' : undefined}
            disabled={isSubmitting}
          >
            <option value="">Select location</option>
            {LOCATIONS.map(loc => (
              <option key={loc.value} value={loc.value}>{loc.label}</option>
            ))}
          </select>
        </ReportFormField>

        <ReportFormField label={dateLabel} htmlFor="date" required error={touched.date ? errors.date : undefined}>
          <input
            ref={el => { if (!firstErrorRef.current && touched.date && errors.date) firstErrorRef.current = el; }}
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={e => handleChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            max={today}
            className={cn(
              'w-full px-4 py-3 text-base',
              'bg-white border border-black/10 rounded-card',
              'focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand',
              'transition-colors duration-150 ease-out',
              touched.date && errors.date && 'border-brand focus:border-brand focus:ring-brand'
            )}
            placeholder={datePlaceholder}
            aria-invalid={touched.date && !!errors.date}
            aria-describedby={touched.date && errors.date ? 'date-error' : undefined}
            disabled={isSubmitting}
          />
        </ReportFormField>

        <ReportFormField label="Image (Optional)" htmlFor="image-upload" error={errors.image} hint="Max 5MB. JPG, PNG, WebP, GIF.">
          <ImageUpload
            value={formData.image ?? null}
            onChange={handleImageChange}
            preview={formData.imagePreview}
            error={errors.image}
            maxSizeMB={5}
            acceptedTypes={ACCEPTED_IMAGE_TYPES}
            disabled={isSubmitting}
          />
        </ReportFormField>

        <ReportFormField label="Contact Email" htmlFor="contact" required error={touched.contact ? errors.contact : undefined} hint="We'll only use this to connect you with the finder/owner.">
          <input
            ref={el => { if (!firstErrorRef.current && touched.contact && errors.contact) firstErrorRef.current = el; }}
            type="email"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={e => handleChange('contact', e.target.value)}
            onBlur={() => handleBlur('contact')}
            className={cn(
              'w-full px-4 py-3 text-base',
              'bg-white border border-black/10 rounded-card',
              'focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand',
              'transition-colors duration-150 ease-out',
              touched.contact && errors.contact && 'border-brand focus:border-brand focus:ring-brand'
            )}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={touched.contact && !!errors.contact}
            aria-describedby={touched.contact && errors.contact ? 'contact-error' : undefined}
            disabled={isSubmitting}
          />
        </ReportFormField>
      </div>

      {errors.submit && (
        <div className="p-4 bg-brand/5 border border-brand/20 rounded-card" role="alert">
          <p className="text-sm text-brand">{errors.submit}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Submitting...' : mode === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => window.history.back()} disabled={isSubmitting} className="flex-1 sm:w-auto">
          Cancel
        </Button>
      </div>
    </form>
  );
};

const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'id-card', label: 'ID / Cards' },
  { value: 'bags', label: 'Bags' },
  { value: 'books', label: 'Books' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'other', label: 'Other' },
] as const;

const LOCATIONS = [
  { value: 'library', label: 'Library' },
  { value: 'cafeteria', label: 'Cafeteria' },
  { value: 'academic-block', label: 'Academic Block' },
  { value: 'sports-complex', label: 'Sports Complex' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'parking-area', label: 'Parking Area' },
  { value: 'other', label: 'Other' },
] as const;

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
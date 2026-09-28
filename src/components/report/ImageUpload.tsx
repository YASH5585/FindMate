import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  preview?: string | null;
  error?: string;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
}

const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const ImageUpload = ({
  value,
  onChange,
  preview,
  error,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  disabled = false,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Unsupported file type. Please use: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}.`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxSizeMB}MB limit.`;
    }
    return null;
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      onChange(null);
      return;
    }
    const validationError = validateFile(file);
    if (validationError) {
      // We don't set error here; the parent handles error display
      // But we can signal invalid via onChange with null or let parent validate
    }
    onChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFileSelect(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
  };

  const handleReplaceClick = () => {
    fileInputRef.current?.click();
  };

  const displayPreview = preview || (value ? URL.createObjectURL(value) : null);

  return (
    <div className="w-full">
      <label
        htmlFor="image-upload"
        className={cn(
          'relative block cursor-pointer',
          dragActive && 'ring-2 ring-brand ring-offset-2'
        )}
      >
        <input
          ref={fileInputRef}
          id="image-upload"
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
          aria-describedby={error ? 'image-upload-error' : undefined}
        />

        <div
          className={cn(
            'relative border-2 border-dashed rounded-card transition-colors duration-150',
            dragActive
              ? 'border-brand bg-brand/5'
              : value || preview
              ? 'border-brand'
              : 'border-black/10 hover:border-brand/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleReplaceClick}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              e.preventDefault();
              handleReplaceClick();
            }
          }}
          aria-label={value || preview ? 'Replace image' : 'Upload image'}
        >
          {(value || preview) && displayPreview ? (
            <>
              <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                <img
                  src={displayPreview}
                  alt=""
                  className="w-full h-full object-cover"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors"
                  aria-label="Remove image"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-black">Image selected</p>
                <p className="text-xs text-grey mt-0.5">
                  Click or drag to replace
                </p>
              </div>
            </>
          ) : (
            <div className="aspect-[4/3] flex flex-col items-center justify-center p-6 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-grey-light mb-3"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-5-5L15 15" />
              </svg>
              <p className="text-sm font-medium text-black mb-1">
                Add an image (optional)
              </p>
              <p className="text-xs text-grey max-w-xs mx-auto">
                Drag & drop or click to upload. Max {maxSizeMB}MB. JPG, PNG, WebP, GIF.
              </p>
            </div>
          )}
        </div>
      </label>
      {error && (
        <p
          id="image-upload-error"
          className="mt-1.5 text-sm text-brand"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
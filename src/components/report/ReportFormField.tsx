import { cn } from '@/lib/utils';

interface ReportFormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export const ReportFormField = ({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: ReportFormFieldProps) => (
  <div className={cn('w-full', className)}>
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-sm font-medium text-black mb-2',
        required && 'after:content-["*"] after:ml-0.5 after:text-brand'
      )}
    >
      {label}
    </label>
    <div className="relative">{children}</div>
    {error && (
      <p
        id={`${htmlFor}-error`}
        className="mt-1.5 text-sm text-brand"
        role="alert"
      >
        {error}
      </p>
    )}
    {hint && !error && (
      <p id={`${htmlFor}-hint`} className="mt-1.5 text-sm text-grey">
        {hint}
      </p>
    )}
  </div>
);
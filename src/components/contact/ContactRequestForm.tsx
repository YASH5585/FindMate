import { useState, useRef } from 'react';
import { createContactRequest } from '@/lib/api/contactRequests';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ReportFormField } from '@/components/report/ReportFormField';
import { Spinner } from '@/components/ui/Spinner';
import { Text } from '@/components/ui/Typography';
import { ApiError } from '@/lib/api/client';

const MESSAGE_MAX = 2000;

import type { ButtonVariant } from '@/components/ui/Button';

interface ContactRequestFormProps {
  itemId: string;
  variant?: ButtonVariant;
  onSuccess?: (message: string) => void;
}

export const ContactRequestForm = ({ itemId, variant = 'primary', onSuccess }: ContactRequestFormProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!user) {
    return null;
  }

  const trimmed = message.trim();
  const charCount = message.length;
  const isMessageValid = trimmed.length >= 1 && trimmed.length <= MESSAGE_MAX;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMessageValid || loading) return;
    setLoading(true);
    setError(null);

    try {
      await createContactRequest({ itemId, message: trimmed });
      setSubmitted(true);
      onSuccess?.(trimmed);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('You already have a pending request for this item.');
      } else if (err instanceof ApiError && err.status === 404) {
        setError('This item no longer exists.');
      } else {
        const msg = err instanceof Error ? err.message : 'Could not send your request.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-card bg-surface-subtle border border-black/10 p-6 text-center"
        aria-live="polite"
      >
        <div className="flex justify-center mb-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <Text weight="semibold">Your message has been sent.</Text>
        <Text color="muted" size="sm" className="mt-1">
          The owner will be notified and can respond through your contact requests.
        </Text>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ReportFormField
        label="Your message"
        htmlFor={`contact-message-${itemId}`}
        error={error ?? (trimmed.length === 0 && message.length > 0 ? 'Message is required' : undefined)}
        hint={`${charCount}/${MESSAGE_MAX} characters`}
      >
        <textarea
          id={`contact-message-${itemId}`}
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError(null);
          }}
          placeholder="I found this item. Where can I return it?"
          rows={4}
          maxLength={MESSAGE_MAX + 50}
          disabled={loading}
          className="w-full px-4 py-3 rounded-card border border-black/10 bg-white resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50"
          aria-label="Message to send to the item owner"
        />
      </ReportFormField>

      {error && (
        <Text size="sm" role="alert" className="text-brand font-medium">
          {error}
        </Text>
      )}

      <Button
        type="submit"
        variant={variant}
        size="lg"
        disabled={!isMessageValid || loading}
        className="w-full"
      >
        {loading ? <Spinner size="sm" /> : 'Send Message'}
      </Button>
    </form>
  );
};

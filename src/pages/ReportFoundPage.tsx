import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { ReportForm } from '@/components/report/ReportForm';
import { LoginPrompt } from '@/components/auth/LoginPrompt';
import { useAuth } from '@/hooks/useAuth';
import type { ReportFormData, ReportSubmitResult } from '@/types/report';
import { createItem, toCreateItemRequest, uploadImage } from '@/lib/api/items';
import { ApiError } from '@/lib/api/client';

export const ReportFoundPage = () => {
  const { user } = useAuth();

  const handleSubmit = async (data: ReportFormData): Promise<ReportSubmitResult> => {
    const reporterName = user?.name ?? 'Current User';
    const contact = data.contact;
    let imageUrl: string | null = null;

    if (data.image) {
      try {
        imageUrl = await uploadImage(data.image);
      } catch (err) {
        if (err instanceof ApiError && err.status === 501) {
          return { success: false, error: 'Image uploads are not configured.' };
        }
        const message = err instanceof Error ? err.message : 'Could not upload image.';
        return { success: false, error: message };
      }
    }

    const newItem = toCreateItemRequest(data, reporterName, 'found', contact, imageUrl);

    try {
      const saved = await createItem(newItem);
      return { success: true, item: saved };
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { success: false, error: 'You must be signed in to report a found item.' };
      }
      const message = err instanceof Error ? err.message : 'Could not submit your report.';
      return { success: false, error: message };
    }
  };

  if (!user) {
    return (
      <Section className="py-12 md:py-20">
        <Container>
          <LoginPrompt message="You need to be signed in to report a found item." />
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section id="report-found-hero" className="py-12 md:py-16 bg-white border-b border-black/10">
        <Container>
          <div className="max-w-3xl">
            <Text size="sm" color="muted" className="mb-3 tracking-widest uppercase">
              REPORT FOUND
            </Text>
            <Heading level={1} size="display" weight="extrabold" className="tracking-tight mb-4">
              Help an item find its owner.
            </Heading>
            <Text size="lg" color="muted" className="max-w-2xl leading-relaxed">
              Share what you found so the right person can identify and reclaim it.
            </Text>
          </div>
        </Container>
      </Section>

      <Section id="report-found-form" className="py-12 md:py-16 bg-surface-subtle">
        <Container>
          <ReportForm mode="found" onSubmit={handleSubmit} />
        </Container>
      </Section>
    </>
  );
};

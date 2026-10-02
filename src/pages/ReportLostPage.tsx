import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { ReportForm } from '@/components/report/ReportForm';
import { LoginPrompt } from '@/components/auth/LoginPrompt';
import { useAuth } from '@/hooks/useAuth';
import type { ReportFormData, ReportSubmitResult } from '@/types/report';
import { createItem, toCreateItemRequest } from '@/lib/api/items';
import { ApiError } from '@/lib/api/client';

export const ReportLostPage = () => {
  const { user } = useAuth();

  const handleSubmit = async (data: ReportFormData): Promise<ReportSubmitResult> => {
    const reporterName = user?.name ?? 'Current User';
    const contact = data.contact;
    const newItem = toCreateItemRequest(data, reporterName, 'lost', contact);

    try {
      const saved = await createItem(newItem);
      return { success: true, item: saved };
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { success: false, error: 'You must be signed in to report an item.' };
      }
      const message = err instanceof Error ? err.message : 'Could not submit your report.';
      return { success: false, error: message };
    }
  };

  if (!user) {
    return (
      <Section className="py-12 md:py-20">
        <Container>
          <LoginPrompt message="You need to be signed in to report a lost item." />
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section id="report-lost-hero" className="py-12 md:py-16 bg-white border-b border-black/10">
        <Container>
          <div className="max-w-3xl">
            <Text size="sm" color="muted" className="mb-3 tracking-widest uppercase">
              REPORT LOST
            </Text>
            <Heading level={1} size="display" weight="extrabold" className="tracking-tight mb-4">
              Tell us what went missing.
            </Heading>
            <Text size="lg" color="muted" className="max-w-2xl leading-relaxed">
              Add the details that can help someone recognize and return your item.
            </Text>
          </div>
        </Container>
      </Section>

      <Section id="report-lost-form" className="py-12 md:py-16 bg-surface-subtle">
        <Container>
          <ReportForm mode="lost" onSubmit={handleSubmit} />
        </Container>
      </Section>
    </>
  );
};

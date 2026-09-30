import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { ReportForm } from '@/components/report/ReportForm';
import type { ReportFormData, ReportSubmitResult } from '@/types/report';
import { createItem, toCreateItemRequest } from '@/lib/api/items';

export const ReportFoundPage = () => {
  const handleSubmit = async (data: ReportFormData): Promise<ReportSubmitResult> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const reporterName = 'Current User';
    const contact = data.contact;
    const newItem = toCreateItemRequest(data, reporterName, 'found', contact);

    try {
      const saved = await createItem(newItem);
      return { success: true, item: saved };
    } catch {
      const fallback = {
        ...newItem,
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const storedReports = JSON.parse(localStorage.getItem('findmate_reports') || '[]');
      storedReports.unshift(fallback);
      localStorage.setItem('findmate_reports', JSON.stringify(storedReports));
      return { success: true, item: fallback };
    }
  };

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
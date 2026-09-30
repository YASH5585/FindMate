import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { ReportForm } from '@/components/report/ReportForm';
import type { ReportFormData, ReportSubmitResult } from '@/types/report';
import { createItem, toCreateItemRequest } from '@/lib/api/items';

export const ReportLostPage = () => {
  const handleSubmit = async (data: ReportFormData): Promise<ReportSubmitResult> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const reporterName = 'Current User';
    const contact = data.contact;
    const newItem = toCreateItemRequest(data, reporterName, 'lost', contact);

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
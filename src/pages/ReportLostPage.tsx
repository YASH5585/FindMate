import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { ReportForm } from '@/components/report/ReportForm';
import type { ReportFormData, ReportSubmitResult } from '@/types/report';

export const ReportLostPage = () => {
  const handleSubmit = async (data: ReportFormData): Promise<ReportSubmitResult> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create new item from form data
    const newItem = {
      id: `${Date.now()}`,
      name: data.name,
      status: 'lost' as const,
      category: data.category,
      description: data.description,
      location: data.location,
      date: data.date,
      image: data.imagePreview,
      reporterName: 'Current User',
      contact: data.contact,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage for persistence
    const storedReports = JSON.parse(localStorage.getItem('findmate_reports') || '[]');
    storedReports.unshift(newItem);
    localStorage.setItem('findmate_reports', JSON.stringify(storedReports));

    return { success: true, item: newItem };
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
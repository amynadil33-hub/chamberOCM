import React from 'react';
import { Wrench } from 'lucide-react';
import { Card, Container, PageHeader } from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';

interface UnderDevelopmentPageProps {
  title: string;
  description?: string;
}

const UnderDevelopmentPage: React.FC<UnderDevelopmentPageProps> = ({
  title,
  description = 'This section is being updated with current MNCCI information.',
}) => {
  usePageMeta(`${title} — Under Development`, description);

  return (
    <>
      <PageHeader
        eyebrow="MNCCI"
        title={title}
        description={description}
        breadcrumbs={[{ label: title }]}
      />
      <Container className="py-16">
        <Card className="mx-auto max-w-2xl p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand">
            <Wrench className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-semibold text-ink">Under Development</h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
            {description} Please check back as approved information becomes available.
          </p>
        </Card>
      </Container>
    </>
  );
};

export default UnderDevelopmentPage;

import { createFileRoute } from '@tanstack/react-router';
import { ContentCreatePage } from '@/components/admin/content-create/content-create-page';

export const Route = createFileRoute('/admin/content-create')({
  component: ContentCreatePage,
});

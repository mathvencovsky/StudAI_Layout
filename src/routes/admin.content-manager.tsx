import { createFileRoute } from '@tanstack/react-router';
import { ContentManagerPage } from '@/components/admin/content-manager/content-manager-page';

export const Route = createFileRoute('/admin/content-manager')({
  component: ContentManagerPage,
});

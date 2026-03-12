import { createFileRoute } from '@tanstack/react-router';
import { DiscoveryPage } from '@/components/discovery';

export const Route = createFileRoute('/discovery')({
  component: DiscoveryPage,
  meta: () => [
    {
      title: 'Descobrir Trilha de Estudo - StudAI',
      description: 'Encontre a trilha de estudo perfeita para seus objetivos com nossa IA especializada'
    }
  ]
});

export default Route;
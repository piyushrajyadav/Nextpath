import CareerDetailClient from '@/app/careers/[id]/CareerDetailClient';

// This is a server component
export default function CareerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <CareerDetailClient id={params.id} />;
} 

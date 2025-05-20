import CareerDetailClient from '@/app/careers/[id]/CareerDetailClient';
import { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Career Details - ${params.id}`,
  }
}

export default function CareerDetailPage({ params }: PageProps) {
  return <CareerDetailClient id={params.id} />;
} 

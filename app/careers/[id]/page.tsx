import CareerDetailClient from '@/app/careers/[id]/CareerDetailClient';
import { Metadata } from 'next';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Career Details - ${params.id}`,
  }
}

export default function CareerDetailPage(props: Props) {
  return <CareerDetailClient id={props.params.id} />;
} 

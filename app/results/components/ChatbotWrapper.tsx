'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false in this client component
const CareerChatbot = dynamic(
  () => import('./CareerChatbot'),
  { ssr: false }
);

export default function ChatbotWrapper() {
  return <CareerChatbot />;
} 
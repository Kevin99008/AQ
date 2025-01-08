'use client';
import dynamic from 'next/dynamic'

const DynamicUserWrapper = dynamic(
  () => import('@/components/auth/userWrapper'), {
    ssr: false, // Disable SSR for this component
  }
);

export default DynamicUserWrapper
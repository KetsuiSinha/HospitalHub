'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from "@/components/LandingPage";
import { getAuthUser } from "@/lib/api";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  return <LandingPage />;
}

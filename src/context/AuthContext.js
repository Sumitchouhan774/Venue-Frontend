'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Pages that don't require authentication
  const publicRoutes = ['/login', '/register'];

  useEffect(() => {
    const token = localStorage.getItem('token');

    // If no token and trying to access a protected page, redirect to login
    if (!token && !publicRoutes.includes(pathname)) {
      router.push('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}

'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '../../hooks/use-api';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="h-8 w-8 animate-spin text-[#f08804]" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

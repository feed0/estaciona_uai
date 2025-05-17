'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdmins } from '@/hooks/useAdmins';
import { AdminListItem } from '@/components/AdminListItem';
import { AdminFormModal } from '@/components/AdminFormModal';
import { Admin } from '@/types/admin';
import { useParams } from 'next/navigation';

export default function ManagerDashboardPage() {
  const params = useParams();
  const userId = params.userId;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
        <p>User ID: {userId}</p>
        {/* Add your manager-specific dashboard content here */}
      </div>
    </div>
  );
}
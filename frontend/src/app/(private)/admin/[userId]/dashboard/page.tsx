'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ParkingSpaceDashboard from '@/components/ParkingSpaceDashboard';

export default function AdminDashboardPage() {
  const params = useParams();
  const userId =
      typeof params.userId === 'string' ? params.userId : (Array.isArray(params.userId) ? params.userId[0] : undefined);

  if (!userId) {
    return <div>Error: User ID is not defined.</div>;
  }

  return (
      <div>
          <ParkingSpaceDashboard adminId={userId} />
          {/*<div className="min-h-screen flex items-center justify-center p-8">*/}
          {/*  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">*/}
          {/*    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>*/}
          {/*    <p>User ID: {userId}</p>*/}
          {/*  </div>*/}
          {/*</div>*/}
      </div>
  );
}
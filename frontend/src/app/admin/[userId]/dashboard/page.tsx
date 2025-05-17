'use client';

import { useParams } from 'next/navigation';

export default function AdminDashboardPage() {
  const params = useParams();
  const userId = params.userId;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>User ID: {userId}</p>
        {/* Add your admin-specific dashboard content here */}
      </div>
    </div>
  );
}
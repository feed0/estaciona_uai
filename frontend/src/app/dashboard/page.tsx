// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdmins } from '@/hooks/useAdmins';
import { AdminListItem } from '@/components/AdminListItem';
import { AdminFormModal } from '@/components/AdminFormModal';
import { Admin } from '@/types/admin';

export default function ManagerDashboard() {
  const managerId = 'your-manager-id'; // You'll need to get this from your auth context
  const { admins, loading, createAdmin, updateAdmin, deleteAdmin } = useAdmins(managerId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | undefined>();

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleDelete = async (adminId: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      await deleteAdmin(adminId);
    }
  };

  const handleModalSubmit = async (data: Omit<Admin, 'id'>) => {
    if (selectedAdmin) {
      await updateAdmin(selectedAdmin.id, data);
    } else {
      await createAdmin(data);
    }
    setSelectedAdmin(undefined);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          <Plus size={20} />
          Add Admin
        </button>
      </div>

      <div className="space-y-4">
        {admins.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Register your first admin!
          </div>
        ) : (
          admins.map((admin) => (
            <AdminListItem
              key={admin.id}
              admin={admin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <AdminFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAdmin(undefined);
        }}
        onSubmit={handleModalSubmit}
        initialData={selectedAdmin}
      />
    </div>
  );
}
// frontend/src/app/(private)/manager/[userId]/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, LogOut } from 'lucide-react';
import AdminCard from '@/components/AdminCard';
import AdminFormModal from '@/components/AdminFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Admin } from '@/types/generated';

export default function ManagerDashboardPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managerName, setManagerName] = useState<string>('');

  // For modals
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('authToken');
    // Redirect to home page
    router.push('/');
  };

  const fetchManagerData = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/manager/${userId}`);
      if (!res.ok) throw new Error('Failed to load manager data.');
      const data = await res.json();
      setManagerName(data.name);
    } catch (e: any) {
      console.error('Error fetching manager data:', e);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/manager/${userId}/admins`);
      if (!res.ok) throw new Error('Failed to load admins.');
      const data: Admin[] = await res.json();
      setAdmins(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
    fetchAdmins();
  }, []);

  const handleCreate = () => {
    setEditingAdmin(null);
    setShowForm(true);
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setShowForm(true);
  };

  const handleDelete = (admin: Admin) => {
    setDeletingAdmin(admin);
  };

  const confirmDelete = async () => {
    if (!deletingAdmin) return;
    try {
      const res = await fetch(`http://localhost:8080/api/manager/${userId}/admins/${deletingAdmin.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setDeletingAdmin(null);
      fetchAdmins();
    } catch (e) {
      alert('Could not delete admin.');
    }
  };

  const onFormSubmit = async (payload: { name: string; email: string; password: string }) => {
    const url = editingAdmin
        ? `http://localhost:8080/api/manager/${userId}/admins/${editingAdmin.id}`
        : `http://localhost:8080/api/manager/${userId}/admins`;
    const method = editingAdmin ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setShowForm(false);
      fetchAdmins();
    } else {
      alert('Operation failed.');
    }
  };

  return (
      <div className="p-8 relative">
        <button onClick={handleCreate} className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          <Plus size={20} />
        </button>
        <div className="flex items-center gap-4 mb-6">
          <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
          {managerName && <h1 className="text-3xl font-bold">Welcome, {managerName}</h1>}
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-600">My Admins</h2>
        <div className="mb-5"></div>

        {loading && <p>Loading admins…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && admins.length === 0 && (
            <p className="italic text-gray-600">Register your first admin!</p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {admins.map((admin) => (
            <AdminCard
              key={admin.id}
              admin={admin}
              onEdit={() => handleEdit(admin)}
              onDelete={() => handleDelete(admin)}
            />
          ))}
        </div>

        {showForm && (
            <AdminFormModal
                admin={editingAdmin}
                onClose={() => setShowForm(false)}
                onSubmit={onFormSubmit}
            />
        )}

        {deletingAdmin && (
            <ConfirmDialog
                message={`Delete admin ${deletingAdmin.email}?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeletingAdmin(null)}
            />
        )}
      </div>
  );
}
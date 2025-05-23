'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import AdminListItem from '@/components/AdminListItem';
import AdminFormModal from '@/components/AdminFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Admin } from '@/types/generated';

export default function ManagerDashboardPage() {
  const { userId } = useParams();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For modals
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);

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
      const res = await fetch(`http://localhost:8080/api/manager${userId}/admins/${deletingAdmin.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setDeletingAdmin(null);
      fetchAdmins();
    } catch (e) {
      alert('Could not delete admin.');
    }
  };

  const onFormSubmit = async (payload: { name: string; email: string; password: string }) => {
    const url = editingAdmin
      ? `http://localhost:8080/api/manager/${userId}/admin/${editingAdmin.id}`
      : `http://localhost:8080/api/manager/${userId}/admin`;
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
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Admins</h1>
        <button
          onClick={handleCreate}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus size={20} />
        </button>
      </div>

      {loading && <p>Loading admins…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && admins.length === 0 && (
        <p className="italic text-gray-600">Register your first admin!</p>
      )}

      <ul className="space-y-2">
        {admins.map((admin) => (
          <AdminListItem
            key={admin.id}
            admin={admin}
            onEdit={() => handleEdit(admin)}
            onDelete={() => handleDelete(admin)}
          />
        ))}
      </ul>

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
// src/components/AdminFormModal.tsx
import { Admin } from '@/types/admin';
import { Modal } from '@geist-ui/core';
import { useState } from 'react';

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Admin, 'id'>) => void;
  initialData?: Admin;
}

export const AdminFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AdminFormModalProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal visible={isOpen} onClose={onClose}>
      <Modal.Title>
        {initialData ? 'Edit Admin' : 'Create New Admin'}
      </Modal.Title>
      <Modal.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required={!initialData}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
};
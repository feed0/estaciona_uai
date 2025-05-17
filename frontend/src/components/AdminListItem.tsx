// src/components/AdminListItem.tsx
import { Admin } from '@/types/admin';
import { Pencil, Trash2 } from 'lucide-react';

interface AdminListItemProps {
  admin: Admin;
  onEdit: (admin: Admin) => void;
  onDelete: (adminId: string) => void;
}

export const AdminListItem = ({ admin, onEdit, onDelete }: AdminListItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <span className="text-gray-700">{admin.email}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(admin)}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={() => onDelete(admin.id)}
          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};
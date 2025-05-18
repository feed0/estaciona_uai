import { Pencil, Trash2 } from 'lucide-react';
import { Admin } from '@/types/generated';

interface Props {
  admin: Admin;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AdminListItem({ admin, onEdit, onDelete }: Props) {
  return (
    <li className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded shadow">
      <span>{admin.email}</span>
      <div className="flex space-x-2">
        <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
          <Pencil size={18} />
        </button>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}
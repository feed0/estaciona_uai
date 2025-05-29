// frontend/src/components/AdminCard.tsx
import React from 'react';
import { Admin } from '@/types/generated';

interface Props {
  admin: Admin;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AdminCard({ admin, onEdit, onDelete }: Props) {
  return (
    <div className="rounded border p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold">{admin.name}</h3>
        <p className="text-gray-600">{admin.email}</p>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={onEdit} className="text-blue-600">
          <span role="img" aria-label="edit">✏️</span>
        </button>
        <button onClick={onDelete} className="text-red-600">
          <span role="img" aria-label="delete">🗑️</span>
        </button>
      </div>
    </div>
  );
}
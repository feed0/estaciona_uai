// frontend/src/components/ParkingSpaceCard.tsx
import React from 'react';
import { ParkingSpace } from '@/types/generated';

interface Props {
  parkingSpace: ParkingSpace;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ParkingSpaceCard({ parkingSpace, onEdit, onDelete }: Props) {
  return (
    <div className="rounded border p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold">{parkingSpace.identifier}</h3>
        <p>{parkingSpace.status}</p>
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
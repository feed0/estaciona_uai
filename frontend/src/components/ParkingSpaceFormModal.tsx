// frontend/src/components/ParkingSpaceFormModal.tsx
import React, { useState, useEffect } from 'react';

interface Props {
  parkingSpace: { id: string; identifier: string } | null;
  onClose: () => void;
  onSubmit: (identifier: string) => void;
}

export default function ParkingSpaceFormModal({ parkingSpace, onClose, onSubmit }: Props) {
  const [identifier, setIdentifier] = useState(parkingSpace?.identifier || '');

  useEffect(() => {
    setIdentifier(parkingSpace?.identifier || '');
  }, [parkingSpace]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(identifier);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl mb-4">{parkingSpace ? 'Edit Parking Space' : 'Create Parking Space'}</h2>
        <label className="block mb-4">
          Identifier
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </label>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            {parkingSpace ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
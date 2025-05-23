// frontend/src/components/ParkingSpaceDashboard.tsx
    import React, { useState, useEffect } from 'react';
    import ParkingSpaceCard from '@/components/ParkingSpaceCard';
    import ParkingSpaceFormModal from '@/components/ParkingSpaceFormModal';
    import ConfirmDialog from '@/components/ConfirmDialog';
    import { ParkingSpace } from '@/types/generated';

    interface Props {
      adminId: string;
    }

    export default function ParkingSpaceDashboard({ adminId }: Props) {
      const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
      const [showFormModal, setShowFormModal] = useState(false);
      const [selectedParkingSpace, setSelectedParkingSpace] = useState<ParkingSpace | null>(null);
      const [showConfirm, setShowConfirm] = useState(false);
      const [deleteTarget, setDeleteTarget] = useState<ParkingSpace | null>(null);

      const baseUrl = 'http://localhost:8080';

      const getParkingSpaces = async () => {
        const response = await fetch(`${baseUrl}/api/admin/${adminId}/parking-space`);
        const data = await response.json();
        setParkingSpaces(data);
      };

      useEffect(() => {
        getParkingSpaces();
      }, [adminId]);

      const handleCreate = () => {
        setSelectedParkingSpace(null);
        setShowFormModal(true);
      };

      const handleEdit = (ps: ParkingSpace) => {
        setSelectedParkingSpace(ps);
        setShowFormModal(true);
      };

      const handleDelete = (ps: ParkingSpace) => {
        setDeleteTarget(ps);
        setShowConfirm(true);
      };

      const submitForm = async (identifier: string) => {
          try {
              const method = selectedParkingSpace ? 'PATCH' : 'POST';
              const url = selectedParkingSpace
                  ? `${baseUrl}/api/admin/${adminId}/parking-space/${selectedParkingSpace.id}`
                  : `${baseUrl}/api/admin/${adminId}/parking-space`;
              const response = await fetch(url, {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ identifier }),
              });
              if (!response.ok) {
                  throw new Error("Load failed");
              }
              setShowFormModal(false);
              getParkingSpaces();
          } catch (error) {
              console.error(error);
          }
      };

      const confirmDelete = async () => {
        if (deleteTarget) {
          await fetch(`${baseUrl}/api/admin/${adminId}/parking-space/${deleteTarget.id}`, {
            method: 'DELETE',
          });
        }
        setShowConfirm(false);
        getParkingSpaces();
      };

      return (
        <div className="p-8 relative">
          <button onClick={handleCreate} className="absolute top-4 right-4">
            <span role="img" aria-label="plus">➕</span>
          </button>
          <div className="grid grid-cols-3 gap-4">
            {parkingSpaces.map((ps) => (
              <ParkingSpaceCard
                key={ps.id}
                parkingSpace={ps}
                onEdit={() => handleEdit(ps)}
                onDelete={() => handleDelete(ps)}
              />
            ))}
          </div>
          {showFormModal && (
            <ParkingSpaceFormModal
              parkingSpace={selectedParkingSpace}
              onClose={() => setShowFormModal(false)}
              onSubmit={submitForm}
            />
          )}
          {showConfirm && deleteTarget && (
            <ConfirmDialog
              message="Are you sure you want to delete this Parking Space?"
              onConfirm={confirmDelete}
              onCancel={() => setShowConfirm(false)}
            />
          )}
        </div>
      );
    }
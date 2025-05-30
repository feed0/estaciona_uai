import React, { useState, useEffect } from 'react';
import ParkingSpaceCard from '@/components/ParkingSpaceCard';
import ParkingSpaceFormModal from '@/components/ParkingSpaceFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ParkingSpace } from '@/types/generated';
import { Plus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
    adminId: string;
}

export default function ParkingSpaceDashboard({ adminId }: Props) {
    const router = useRouter();
    const [parkingName, setParkingName] = useState<string>('');
    const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedParkingSpace, setSelectedParkingSpace] = useState<ParkingSpace | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ParkingSpace | null>(null);

    const baseUrl = 'http://localhost:8080';

    const handleLogout = () => {
        // Clear authentication state
        localStorage.removeItem('authToken');
        // Redirect to home page
        router.push('/');
    };

    const getParkingSpaces = async () => {
        const response = await fetch(`${baseUrl}/api/admin/${adminId}/parking-space`);
        const data = await response.json();
        setParkingSpaces(data);

        // Set parking name from the first space (they all belong to the same parking)
        if (data.length > 0) {
            setParkingName(data[0].parkingName);
        }
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
                {parkingName && <h1 className="text-3xl font-bold">{parkingName}</h1>}
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-600">Parking Spaces</h2>
            <div className="mb-5"></div>
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
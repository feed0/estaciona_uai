// frontend/src/app/customer/[userId]/dashboard/[parkingId]/spaces/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface ParkingSpace {
  id: string;
  identifier: string;
  status: string;
}

interface ParkingDetail {
  id: string;
  name: string;
  address: string;
  parkingSpaces?: ParkingSpace[];
}

export default function ParkingSpacesPage() {
  const params = useParams();
  const router = useRouter();
  const [reservationDuration, setReservationDuration] = useState<number>(60); // default to 1 hour
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { userId, parkingId } = params as { userId: string; parkingId: string };
  const [parkingDetail, setParkingDetail] = useState<ParkingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);

  // Function to handle navigation back to dashboard
  const handleBackToDashboard = () => {
    router.push(`/customer/${userId}/dashboard`);
  };

  useEffect(() => {
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkMediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkMediaQuery.addEventListener('change', handler);
    return () => darkMediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const fetchParkingDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/customer/parkings/${parkingId}/spaces`);
        const data = await response.json();
        console.log('Fetched parking detail:', data);
        setParkingDetail(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchParkingDetail();
  }, [parkingId]);

  const reserveSpace = async (space: ParkingSpace, durationMinutes: number) => {
    try {
      // Calculate endAt time with timezone adjustment
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
      const timezoneOffset = endTime.getTimezoneOffset() * 60000; // Convert to milliseconds
      const adjustedEndTime = new Date(endTime.getTime() - timezoneOffset);

      const response = await fetch(`http://localhost:8080/api/customer/${userId}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parkingSpaceId: space.id,
          parkingId: parkingId,
          endAt: adjustedEndTime.toISOString()
        }),
      });

      if (response.ok) {
        // Update UI to reflect the reservation
        setParkingDetail((prev) => {
          if (!prev || !prev.parkingSpaces) return prev;
          return {
            ...prev,
            parkingSpaces: prev.parkingSpaces.map(s =>
                s.id === space.id ? { ...s, status: 'RESERVED' } : s
            )
          }
        });

        // Show a success message or redirect to reservations page
        alert("Space reserved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to reserve space: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error reserving space:", error);
      alert("Failed to reserve space. Please try again.");
    } finally {
      setSelectedSpace(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!parkingDetail) {
    return <div>No parking details found.</div>;
  }

  // Only show parking spaces with status FREE
  const freeSpaces = (parkingDetail.parkingSpaces || []).filter(space => space.status === 'FREE');

  // Function to format minutes to HH:MM format
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Function to increment/decrement duration in 15-minute steps
  const adjustDuration = (amount: number) => {
    const newDuration = reservationDuration + amount;
    // Ensure duration is between 15 minutes and 24 hours (1440 minutes)
    if (newDuration >= 15 && newDuration <= 1440) {
      setReservationDuration(newDuration);
    }
  };

  return (
      <div className="min-h-screen p-8">
        {/* Back button at top left */}
        <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold mb-2">{parkingDetail.name}</h1>
        <p className="mb-6">{parkingDetail.address}</p>
      <div>
        {freeSpaces.length === 0 ? (
          <p>No parking spaces available.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeSpaces.map((space) => (
              <li key={space.id} className="border p-4 rounded shadow cursor-pointer" onClick={() => setSelectedSpace(space)}>
                <p className="font-semibold">Space: {space.identifier}</p>
                <p>Status: {space.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedSpace && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className={(isDarkMode ? 'bg-gray-800' : 'bg-white') + ' p-6 rounded shadow-md w-full max-w-sm'}>
              <p className={(isDarkMode ? 'text-gray-200' : 'text-gray-800') + ' mb-4'}>
                Do you want to reserve the space
              </p>
              <p className={(isDarkMode ? 'text-gray-200' : 'text-gray-800') + ' mb-4'}>
                "{selectedSpace.identifier}" ?
              </p>

              <div className="mb-6">
                <label className={(isDarkMode ? 'text-gray-200' : 'text-gray-800') + ' block mb-2'}>
                  Duration (HH:MM):
                </label>
                <div className="flex items-center">
                  <button
                      onClick={() => adjustDuration(-15)}
                      className={(isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200') + ' px-3 py-1 rounded-l'}
                  >
                    -
                  </button>
                  <div className={(isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-100') + ' px-4 py-1 text-center w-24'}>
                    {formatDuration(reservationDuration)}
                  </div>
                  <button
                      onClick={() => adjustDuration(15)}
                      className={(isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200') + ' px-3 py-1 rounded-r'}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                    className={(isDarkMode
                        ? 'bg-gray-600 text-gray-200'
                        : 'bg-gray-300 text-gray-800') + ' px-4 py-2 rounded'}
                    onClick={() => setSelectedSpace(null)}
                >
                  Cancel
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => {
                      // Pass the duration to reserveSpace
                      reserveSpace(selectedSpace, reservationDuration);
                    }}
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
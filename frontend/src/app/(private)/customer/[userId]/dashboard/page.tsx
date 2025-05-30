// frontend/src/app/customer/[userId]/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface ParkingSummary {
  id: string;
  name: string;
  address: string;
}

interface Reservation {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  parkingName: string;
  parkingSpaceIdentifier: string;
}

const formatDate = (dateString: string): string => {
  const d = new Date(dateString);
  const day = ('0' + d.getDate()).slice(-2);
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const year = d.getFullYear().toString().slice(-2);
  const hours = ('0' + d.getHours()).slice(-2);
  const minutes = ('0' + d.getMinutes()).slice(-2);
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function CustomerDashboardPage() {
  const params = useParams();
  const userId = params.userId;
  const router = useRouter();
  const [customerName, setCustomerName] = useState<string>('');
  const [parkings, setParkings] = useState<ParkingSummary[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'parkings' | 'reservations'>('parkings');
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('authToken');
    // Redirect to home page
    router.push('/');
  };

  useEffect(() => {
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkMediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkMediaQuery.addEventListener('change', handler);
    return () => darkMediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customer data
        const customerResponse = await fetch(`http://localhost:8080/api/customer/${userId}`);
        if (customerResponse.ok) {
          const customerData = await customerResponse.json();
          setCustomerName(customerData.name);
        }

        const parkingsResponse = await fetch('http://localhost:8080/api/customer/parkings');
        const parkingsData = await parkingsResponse.json();
        setParkings(parkingsData);

        const reservationsResponse = await fetch(`http://localhost:8080/api/customer/${userId}/reservations`);
        const reservationsData = await reservationsResponse.json();
        setReservations(reservationsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const cancelReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/customer/${userId}/reservations/${reservationId}/cancel`, {
        method: 'PATCH'
      });
      if (response.ok) {
        const res = await fetch(`http://localhost:8080/api/customer/${userId}/reservations`);
        const reservationsData = await res.json();
        setReservations(reservationsData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="p-8 relative">
        <div className="flex items-center gap-4 mb-6">
          <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
          {customerName && <h1 className="text-3xl font-bold">Welcome, {customerName}</h1>}
        </div>
        <div className="flex mb-6 border-b">

          <button
              className={`mr-4 pb-2 ${selectedTab === 'parkings' ? 'border-b-2 font-bold' : ''}`}
              onClick={() => setSelectedTab('parkings')}
          >
            Parkings
          </button>
          <button
              className={`pb-2 ${selectedTab === 'reservations' ? 'border-b-2 font-bold' : ''}`}
              onClick={() => setSelectedTab('reservations')}
          >
            My Reservations
          </button>
        </div>
        {selectedTab === 'parkings' && (
            <div>
              {parkings.length === 0 ? (
                  <p>No parkings found.</p>
              ) : (
                  <ul>
                    {parkings.map((parking) => (
                        <li
                            key={parking.id}
                            className="border p-4 my-2 cursor-pointer"
                            onClick={() => router.push(`/customer/${userId}/dashboard/${parking.id}/spaces`)}
                        >
                          <h3 className="font-bold">{parking.name}</h3>
                          <p>{parking.address}</p>
                        </li>
                    ))}
                  </ul>
              )}
            </div>
        )}
        {selectedTab === 'reservations' && (
            <div>
              {reservations.length === 0 ? (
                  <p>No reservations found.</p>
              ) : (
                  <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id} className="border p-4 my-2 flex justify-between items-center">
                          <div>
                            <p>
                              <b>Space:</b> {reservation.parkingSpaceIdentifier} @ <b>Parking</b>: {reservation.parkingName}
                            </p>
                            <p>
                              <b>from:</b> {formatDate(reservation.startAt)}
                            </p>
                            <p>
                              <b>to:</b> {formatDate(reservation.endAt)}
                            </p>
                            <p className="mt-2">
                              <b>Status:</b> {reservation.status}
                            </p>
                          </div>
                          {(reservation.status !== 'COMPLETED' && reservation.status !== 'CANCELLED') && (
                              <button
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => setReservationToCancel(reservation)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
                                </svg>
                              </button>
                          )}
                        </li>
                    ))}
                  </ul>
              )}
            </div>
        )}
        {reservationToCancel && (
            <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className={(isDarkMode ? 'bg-gray-800' : 'bg-white') + ' p-6 rounded shadow-md w-full max-w-sm'}>
                <p className={(isDarkMode ? 'text-gray-200' : 'text-gray-800') + ' mb-4'}>
                  Are you sure you want to cancel this reservation?
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                      className={
                          (isDarkMode
                              ? 'bg-gray-600 text-gray-200'
                              : 'bg-gray-300 text-gray-800') + ' px-4 py-2 rounded'
                      }
                      onClick={() => setReservationToCancel(null)}
                  >
                    Cancel
                  </button>
                  <button
                      className="px-4 py-2 bg-red-600 text-white rounded"
                      onClick={async () => {
                        if (reservationToCancel) {
                          await cancelReservation(reservationToCancel.id);
                          setReservationToCancel(null);
                        }
                      }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
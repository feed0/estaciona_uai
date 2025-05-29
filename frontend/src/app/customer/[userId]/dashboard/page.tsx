// frontend/src/app/customer/[userId]/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ParkingSummary {
  id: string;
  name: string;
  address: string;
}

interface Reservation {
  id: string;
  startAt: string;
  endAt: string;
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
  const [parkings, setParkings] = useState<ParkingSummary[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'parkings' | 'reservations'>('parkings');

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
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
          <h2 className="text-2xl font-semibold mb-2">Parkings</h2>
          {parkings.length === 0 ? (
            <p>No parkings found.</p>
          ) : (
            <ul>
              {parkings.map((parking) => (
                <li key={parking.id} className="border p-4 my-2">
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
          <h2 className="text-2xl font-semibold mb-2">My Reservations</h2>
          {reservations.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            <ul>
              {reservations.map((reservation) => (
                <li key={reservation.id} className="border p-4 my-2">
                  <p><b>Space:</b> {reservation.parkingSpaceIdentifier} @<b>Parking</b>: {reservation.parkingName}</p>
                  <p><b>from:</b> {formatDate(reservation.startAt)}</p>
                  <p><b>to:</b> {formatDate(reservation.endAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
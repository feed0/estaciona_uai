'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerSignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parkingName, setParkingName] = useState('');
  const [parkingAddress, setParkingAddress] = useState('');
  const [hourlyPrice, setHourlyPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:8080/api/manager/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          parkingName,
          parkingAddress,
          hourlyPrice: parseFloat(hourlyPrice)
        }),
      });

      if (response.ok) {
        setSuccessMessage('Manager signed up successfully!');
        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');
        setParkingName('');
        setParkingAddress('');
        setHourlyPrice('');

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/signin');
        }, 1500);
      } else {
        const data = await response.text();
        setError(data || 'Failed to sign up. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    }
  };

  return (
    // The outer div no longer has a background class, so it inherits from the body
    <div className="min-h-screen flex items-center justify-center p-8">
      {/*
        The inner div now uses bg-white for light mode and bg-gray-800 for dark mode,
        similar to the sections in app/page.tsx
      */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        {/*
          Changed text color of h1 and labels to adapt to dark mode,
          using gray-700 for light mode and gray-200 for dark mode,
          similar to the text in app/page.tsx
        */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Manager & Parking Signup</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Manager Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Manager Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="parkingName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Parking Name
            </label>
            <input
              id="parkingName"
              name="parkingName"
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={parkingName}
              onChange={(e) => setParkingName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="parkingAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Parking Address
            </label>
            <input
              id="parkingAddress"
              name="parkingAddress"
              type="text"
              required
              minLength={5}
              maxLength={200}
              value={parkingAddress}
              onChange={(e) => setParkingAddress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="hourlyPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Hourly Price
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                  id="hourlyPrice"
                  name="hourlyPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={hourlyPrice}
                  onChange={(e) => setHourlyPrice(e.target.value)}
                  className="mt-1 block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
                type="submit"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6"
            >
              Sign Up
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
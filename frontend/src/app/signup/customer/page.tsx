'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerSignupPage() {

  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDateError, setExpiryDateError] = useState<string | null>(null);

  const validateExpiryDate = (date: string) => {
    if (!date) {
      setExpiryDateError('Expiry date is required');
      return false;
    }

    const today = new Date();
    const expiryMonth = new Date(date);

    if (expiryMonth < today) {
      setExpiryDateError('Expiry date cannot be in the past');
      return false;
    }

    setExpiryDateError(null);
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:8080/api/customer/signup', {

        method: 'POST',
        headers: {

          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {

        setSuccessMessage('Customer signed up successfully!');
        setName('');
        setEmail('');
        setPassword('');

        setTimeout(() => {
          router.push('/signin');  // Changed from router.push('/');
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
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Customer Signup</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Customer Name
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
              Customer Email
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
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Credit Card Number
            </label>
            <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                required
                pattern="[0-9]{16,19}"
                minLength={16}
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="XXXX XXXX XXXX XXXX"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Expiration Date
              </label>
              <input
                  id="expiryDate"
                  name="expiryDate"
                  type="month"
                  required
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                    validateExpiryDate(e.target.value);
                  }}
                  min={new Date().toISOString().slice(0, 7)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {expiryDateError && <p className="text-red-500 text-xs mt-1">{expiryDateError}</p>}
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                CVV
              </label>
              <input
                  id="cvv"
                  name="cvv"
                  type="text"
                  required
                  pattern="[0-9]{3,4}"
                  minLength={3}
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="XXX"
              />
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
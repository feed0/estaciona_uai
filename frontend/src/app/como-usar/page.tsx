'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const intValue = parseInt(inputValue);
      if (isNaN(intValue)) {
        throw new Error('Please enter a valid number');
      }

      // Updated URL to use query parameter
      const response = await fetch(`http://localhost:8080/api/como-usar?number=${intValue}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data from the server');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Spring Boot Integration "como-usar"</h1>
      
      <div className="flex flex-col gap-4 w-full max-w-md mb-4">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
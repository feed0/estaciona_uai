import { useState, useEffect } from 'react';
import { Admin } from '@/types/generated';

interface Props {
  admin: Admin | null;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; password: string }) => void;
}

export default function AdminFormModal({ admin, onClose, onSubmit }: Props) {
  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setName(admin?.name || '');
    setEmail(admin?.email || '');
  }, [admin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl mb-4">{admin ? 'Edit Admin' : 'Create Admin'}</h2>
        <label className="block mb-2">
          Name
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block mb-2">
          Email
          <input
            type="email"
            className="mt-1 w-full border rounded px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {!admin && (
          <label className="block mb-4">
            Password
            <input
              type="password"
              className="mt-1 w-full border rounded px-2 py-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        )}
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            {admin ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
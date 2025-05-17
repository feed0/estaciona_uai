// src/hooks/useAdmins.ts
import { useState, useEffect } from 'react';
import { Admin } from '@/types/admin';

export const useAdmins = (managerId: string) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`/api/managers/${managerId}/admins`);
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (adminData: Omit<Admin, 'id'>) => {
    try {
      const response = await fetch(`/api/managers/${managerId}/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData),
      });
      if (response.ok) {
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  const updateAdmin = async (adminId: string, adminData: Partial<Admin>) => {
    try {
      const response = await fetch(`/api/managers/${managerId}/admins/${adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData),
      });
      if (response.ok) {
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

  const deleteAdmin = async (adminId: string) => {
    try {
      const response = await fetch(`/api/managers/${managerId}/admins/${adminId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [managerId]);

  return { admins, loading, createAdmin, updateAdmin, deleteAdmin };
};
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../constants';

export type CreateEmployeePayload = {
  uuid: string;
  name: string;
  title: string;
  email: string;
  location: string;
  departmentId: number;
  avatar: string | null;
};

export type UpdateEmployeePayload = {
  name: string;
  title: string;
  email: string;
  location: string;
  departmentId: number;
};

// Requests use API_BASE_URL with absolute URLs to avoid fallback complexity

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateEmployeePayload) => {
      const res = await fetch(`${API_BASE_URL}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create employee');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateEmployeePayload }) => {
      const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update employee');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete employee');
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}



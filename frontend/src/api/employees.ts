import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export type Employee = {
  id: number;
  name: string;
  title: string;
  department: string;
  location: string;
  avatar: string;
  email: string;
  departmentId?: number;
};

export type EmployeesApiResponse = {
  items: Employee[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

// Fetch list of employees with query params
export async function fetchEmployees(params: URLSearchParams): Promise<EmployeesApiResponse> {
  const query = `?${params.toString()}`;
  const res = await fetch(`${API_BASE_URL}/api/employees${query}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch employees: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return {
    items: Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [],
    total: Number(data?.total ?? 0),
    page: Number(data?.page ?? Number(params.get('page') ?? 1)),
    limit: Number(data?.limit ?? Number(params.get('limit') ?? 12)),
    pages: Number(data?.pages ?? 1),
  };
}

// Standalone request functions for mutations
export async function createEmployee(payload: CreateEmployeePayload) {
  const res = await fetch(`${API_BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create employee');
  return res.json();
}

export async function updateEmployee(id: number, payload: UpdateEmployeePayload) {
  const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return res.json();
}

export async function deleteEmployee(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete employee');
  return true;
}

// Query hook
export function useFetchEmployees(params: URLSearchParams | string) {
  const paramsString = typeof params === 'string' ? params : params.toString();
  return useQuery<EmployeesApiResponse>({
    queryKey: ['employees', paramsString],
    queryFn: () => fetchEmployees(new URLSearchParams(paramsString)),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateEmployeePayload }) =>
      updateEmployee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}



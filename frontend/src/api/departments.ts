import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../constants';

export type Department = { id: number; name: string };

export type DepartmentsApiResponse = {
  items: Department[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export async function fetchDepartments(): Promise<Department[]> {
  const res = await fetch(`${API_BASE_URL}/api/departments?page=1&limit=100`);
  if (!res.ok) {
    throw new Error(`Failed to fetch departments: ${res.status} ${res.statusText}`);
  }
  const data: DepartmentsApiResponse | Department[] = await res.json();
  if (Array.isArray(data)) return data;
  return Array.isArray((data as DepartmentsApiResponse).items)
    ? (data as DepartmentsApiResponse).items
    : [];
}

export function useFetchDepartments(options?: { staleTime?: number; gcTime?: number }) {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: options?.staleTime ?? 10 * 60 * 1000,
    gcTime: options?.gcTime ?? 30 * 60 * 1000,
  });
}



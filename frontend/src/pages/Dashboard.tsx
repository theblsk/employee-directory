import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TITLES, DEPARTMENTS } from '../../../backend/src/constants';

type Employee = {
  id: string;
  name: string;
  title: string;
  department: string;
  location: string;
  avatar: string;
  email: string;
};

type EmployeesApiResponse = {
  items: Employee[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

const fetchEmployees = async (params: URLSearchParams): Promise<EmployeesApiResponse> => {
  const query = `?${params.toString()}`;
  let res = await fetch(`/api/employees${query}`);
  if (!res.ok) {
    res = await fetch(`http://localhost:4000/api/employees${query}`);
  }
  const data = await res.json();
  return {
    items: Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [],
    total: Number(data?.total ?? 0),
    page: Number(data?.page ?? Number(params.get('page') ?? 1)),
    limit: Number(data?.limit ?? Number(params.get('limit') ?? 12)),
    pages: Number(data?.pages ?? 1),
  };
};

type EmployeeSearchFilter = { searchTerm: string; title: string; department: string };

const Dashboard: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [filter, setFilter] = useState<EmployeeSearchFilter>({ searchTerm: "", title: "", department: "" });

  useEffect(() => {
    setPage(1);
  }, [filter.searchTerm, filter.title, filter.department]);

  const buildParams = () => {
    const queryParams = new URLSearchParams();
    queryParams.set('page', String(page));
    queryParams.set('limit', String(limit));
    if (filter.searchTerm.trim()) queryParams.set('searchTerm', filter.searchTerm.trim());
    if (filter.title) queryParams.set('title', filter.title);
    if (filter.department) queryParams.set('department', filter.department);
    return queryParams;
  };

  const paramsString = buildParams().toString();
  const { data, isLoading, isError } = useQuery<EmployeesApiResponse>({
    queryKey: ['employees', paramsString],
    queryFn: () => fetchEmployees(new URLSearchParams(paramsString)),
  });
  
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Team Directory</h1>
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filter.searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setTimeout(() => {
                  setFilter((prev) => ({ ...prev, searchTerm: value }));
                }, 100);
              }}
              placeholder="Search name, email, title, location..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={filter.title}
              onChange={(e) => setFilter((prev) => ({ ...prev, title: e.target.value }))}
            >
              <option value="">All</option>
              {TITLES.map((t: string) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={filter.department}
              onChange={(e) => setFilter((prev) => ({ ...prev, department: e.target.value }))}
            >
              <option value="">All</option>
              {DEPARTMENTS.map((d: string) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        {isLoading ? <div className="text-gray-500">Loading...</div> : null}
        {isError ? <div className="text-red-500">Failed to load employees.</div> : null}
        {!isLoading && !isError && data ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(data?.items ?? []).map((employee: Employee) => (
              <motion.div key={employee.id} whileHover={{ scale: 1.03 }} className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
                <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="text-lg font-medium text-gray-900">{employee.name}</div>
                  <div className="text-sm text-gray-500">{employee.title} • {employee.department}</div>
                  <div className="text-xs text-gray-400">{employee.location} • {employee.email}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
        {!isLoading && !isError && data ? (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(data?.items?.length ?? 0)} of {data?.total} employees
            </div>
            <div className="space-x-2">
              <button
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">Page {data?.page} / {data?.pages}</span>
              <button
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                disabled={page >= (data?.pages || 1)}
                onClick={() => setPage((p) => Math.min((data?.pages || p + 1), p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Dashboard;


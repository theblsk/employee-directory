import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

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

const fetchEmployees = async (page: number, limit: number): Promise<EmployeesApiResponse> => {
  const query = `?page=${page}&limit=${limit}`;
  let res = await fetch(`/api/employees${query}`);
  if (!res.ok) {
    res = await fetch(`http://localhost:4000/api/employees${query}`);
  }
  const data = await res.json();
  // Ensure shape matches expected structure
  return {
    items: Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [],
    total: Number(data?.total ?? 0),
    page: Number(data?.page ?? page),
    limit: Number(data?.limit ?? limit),
    pages: Number(data?.pages ?? 1),
  };
};

const Dashboard: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const { data, isLoading, isError } = useQuery<EmployeesApiResponse>({
    queryKey: ['employees', page, limit],
    queryFn: () => fetchEmployees(page, limit),
    placeholderData: (prev) => prev,
  });
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Team Directory</h1>
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


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TITLES, DEPARTMENTS } from '../../../backend/src/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDebounce } from '../hooks/useDebounce';
import { useCreateEmployee, useUpdateEmployee, useDeleteEmployee, useFetchEmployees } from '../api/employees';
import type { Employee } from '../api/employees';
import { useFetchDepartments } from '../api/departments';



type EmployeeSearchFilter = { searchTerm: string; title: string; department: string };

const Dashboard: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [filter, setFilter] = useState<EmployeeSearchFilter>({ searchTerm: "", title: "", department: "" });
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState<{ uuid?: string; name: string; title: string; email: string; location: string; departmentId: number | "" }>({
    uuid: undefined,
    name: "",
    title: "",
    email: "",
    location: "",
    departmentId: "",
  });

  const debouncedSearchTerm = useDebounce<string>(filter.searchTerm, 250);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filter.title, filter.department]);

  const buildParams = () => {
    const queryParams = new URLSearchParams();
    queryParams.set('page', String(page));
    queryParams.set('limit', String(limit));
    if (debouncedSearchTerm.trim()) queryParams.set('searchTerm', debouncedSearchTerm.trim());
    if (filter.title) queryParams.set('title', filter.title);
    if (filter.department) queryParams.set('department', filter.department);
    return queryParams;
  };

  const paramsString = buildParams().toString();
  const { data, isLoading, isError } = useFetchEmployees(paramsString);
  const { data: departments } = useFetchDepartments({ staleTime: 10 * 60 * 1000, gcTime: 30 * 60 * 1000 });



  const openCreate = () => {
    setEditingEmployee(null);
    setForm({ uuid: crypto.randomUUID(), name: "", title: "", email: "", location: "", departmentId: "" });
    setIsFormOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setForm({
      uuid: undefined,
      name: emp.name,
      title: emp.title,
      email: emp.email,
      location: emp.location,
      departmentId: (typeof emp.departmentId === 'number' ? emp.departmentId : "") as number | "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const createMutation = useCreateEmployee();

  const updateMutation = useUpdateEmployee();

  const deleteMutation = useDeleteEmployee();
  
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Team Directory</h1>
        <div className="mb-4 flex items-center justify-between">
          <div />
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            onClick={openCreate}
          >
            New Employee
          </button>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filter.searchTerm}
              onChange={(e) => setFilter((prev) => ({ ...prev, searchTerm: e.target.value }))}
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
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-900">{employee.name}</div>
                  <div className="text-sm text-gray-500">{employee.title} • {employee.department}</div>
                  <div className="text-xs text-gray-400">{employee.location} • {employee.email}</div>
                </div>
                <div className="flex flex-col items-center gap-2 justify-center">
                  <button
                    className="w-9 h-9 inline-flex items-center justify-center rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200"
                    onClick={() => openEdit(employee)}
                    aria-label={`Edit ${employee.name}`}
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    className="w-9 h-9 inline-flex items-center justify-center rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                    onClick={() => {
                      if (confirm(`Delete ${employee.name}? This cannot be undone.`)) {
                        deleteMutation.mutate(employee.id);
                      }
                    }}
                    aria-label={`Delete ${employee.name}`}
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
        {isFormOpen ? (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{editingEmployee ? 'Edit Employee' : 'New Employee'}</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={closeForm}>✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <select
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="">Select title</option>
                    {TITLES.map((t: string) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={String(form.departmentId)}
                    onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value ? Number(e.target.value) : "" }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="">Select department</option>
                    {(departments || []).map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2 text-xs text-gray-500">
                  Avatar cannot be changed in this demo.
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                {editingEmployee ? (
                  <button
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={!form.name || !form.email || !form.title || !form.location || !form.departmentId || updateMutation.isPending}
                    onClick={() => {
                      if (!editingEmployee) return;
                      updateMutation.mutate({
                        id: editingEmployee.id,
                        payload: {
                          name: form.name,
                          title: form.title,
                          email: form.email,
                          location: form.location,
                          departmentId: Number(form.departmentId),
                        },
                      });
                      closeForm();
                    }}
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={!form.name || !form.email || !form.title || !form.location || !form.departmentId || createMutation.isPending}
                    onClick={() => {
                      createMutation.mutate({
                        uuid: form.uuid || crypto.randomUUID(),
                        name: form.name,
                        title: form.title,
                        email: form.email,
                        location: form.location,
                        avatar: null,
                        departmentId: Number(form.departmentId),
                      });
                      closeForm();
                    }}
                  >
                    Create
                  </button>
                )}
              </div>
            </div>
          </div>
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


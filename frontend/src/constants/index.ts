
// API base URL for frontend requests. Falls back to localhost:4000 if not defined.
export const API_BASE_URL = import.meta.env?.VITE_BASE_API_URL ?? 'http://localhost:4000';

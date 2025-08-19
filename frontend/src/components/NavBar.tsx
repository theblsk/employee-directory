import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-semibold text-gray-800">Employee Directory</span>
        </div>
        {!isHome && (
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;


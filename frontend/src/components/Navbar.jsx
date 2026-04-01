import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { djangoApi } from '../api/api';

export default function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await djangoApi.get('/users/profile/');
        if (res.data.is_staff || res.data.is_superuser) {
          setIsAdmin(true);
        }
      } catch (err) { }
    };
    if (localStorage.getItem('access_token')) fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-black text-white w-full shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter text-blue-500">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-sm">PS</div>
            <span className="text-white hover:text-blue-300 transition-colors">PaySys</span>
          </Link>
        </div>
        <div className="flex space-x-8 items-center font-medium">
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/add-card" className="text-gray-300 hover:text-white transition-colors">Cards</Link>
          <Link to="/make-payment" className="text-gray-300 hover:text-white transition-colors">Pay</Link>
          <Link to="/transactions" className="text-gray-300 hover:text-white transition-colors">History</Link>
          {isAdmin && (
            <Link to="/admin-dashboard" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">Admin Console</Link>
          )}
          <button 
            onClick={handleLogout} 
            className="px-4 py-1.5 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 hover:text-white transition-all text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <nav className="glass-card sticky top-4 mx-4 rounded-2xl z-50 mt-4 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter text-blue-500">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/20"></div>
            <span className="text-white">PaySys</span>
          </Link>
        </div>
        <div className="flex space-x-8 items-center font-medium">
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/add-card" className="text-gray-300 hover:text-white transition-colors">Cards</Link>
          <Link to="/make-payment" className="text-gray-300 hover:text-white transition-colors">Pay</Link>
          <Link to="/transactions" className="text-gray-300 hover:text-white transition-colors text-gradient">History</Link>
          <button 
            onClick={handleLogout} 
            className="px-5 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/30"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

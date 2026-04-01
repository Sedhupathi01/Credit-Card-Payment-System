import React, { useEffect, useState } from 'react';
import { djangoApi } from '../api/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await djangoApi.get('/users/profile/');
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 animate-in fade-in duration-700">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome back, <span className="text-blue-600">{user ? user.username : 'User'}</span>!
        </h1>
        <p className="text-gray-500">Manage your finances with our secure portal.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="light-card p-8 group hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-800">My Cards</h2>
          <p className="text-gray-500 mb-6text-sm">Securely view and manage your active credit and debit cards.</p>
          <Link to="/add-card" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
            Manage Cards →
          </Link>
        </div>

        <div className="light-card p-8 group hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-800">Make Payment</h2>
          <p className="text-gray-500 mb-6 text-sm">Zero-friction payment processing with instant confirmation.</p>
          <Link to="/make-payment" className="font-bold text-green-600 hover:text-green-800 transition-colors">
            Pay Now →
          </Link>
        </div>

        <div className="light-card p-8 group hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
          <div className="w-14 h-14 bg-purple-50 rounded-lg flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-800">History</h2>
          <p className="text-gray-500 mb-6 text-sm">Review and export your complete transaction history.</p>
          <Link to="/transactions" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
            View Activity →
          </Link>
        </div>
      </div>
    </div>
  );
}

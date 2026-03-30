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
        <h1 className="text-5xl font-black tracking-tight mb-2">
          Welcome back, <span className="text-gradient underline decoration-blue-500/30 underline-offset-8">{user ? user.username : 'User'}</span>!
        </h1>
        <p className="text-gray-400 text-lg">Manage your finances with our premium secure portal.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-3xl group hover:scale-[1.02] transition-all hover:bg-white/5 active:scale-95 border-blue-500/10 hover:border-blue-500/30">
          <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
            <svg className="w-8 h-8 text-blue-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">My Cards</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">Securely view and manage your active credit and debit cards.</p>
          <Link to="/add-card" className="inline-flex items-center gap-2 text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
            Manage Cards <span className="text-blue-500">→</span>
          </Link>
        </div>

        <div className="glass-card p-8 rounded-3xl group hover:scale-[1.02] transition-all hover:bg-white/5 active:scale-95 border-purple-500/10 hover:border-purple-500/30">
          <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
            <svg className="w-8 h-8 text-purple-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">Make Payment</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">Zero-friction payment processing with instant confirmation.</p>
          <Link to="/make-payment" className="inline-flex items-center gap-2 text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
            Pay Now <span className="text-purple-500">→</span>
          </Link>
        </div>

        <div className="glass-card p-8 rounded-3xl group hover:scale-[1.02] transition-all hover:bg-white/5 active:scale-95 border-teal-500/10 hover:border-teal-500/30 md:col-span-2 lg:col-span-1">
          <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 transition-colors">
            <svg className="w-8 h-8 text-teal-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">History</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">Review and export your complete transaction history.</p>
          <Link to="/transactions" className="inline-flex items-center gap-2 text-teal-400 font-bold group-hover:translate-x-1 transition-transform">
            View Activity <span className="text-teal-500">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

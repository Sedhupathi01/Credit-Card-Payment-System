import React, { useEffect, useState } from 'react';
import { djangoApi } from '../api/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersRes = await djangoApi.get('/users/');
        setUsers(usersRes.data);
        const transRes = await djangoApi.get('/transactions/');
        setTransactions(transRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdminData();
  }, []);

  const totalPayments = transactions.reduce((acc, curr) => curr.status === 'SUCCESS' ? acc + parseFloat(curr.amount) : acc, 0);

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4 pb-20 animate-in slide-in-from-top duration-500">
      <h2 className="text-4xl font-black mb-10 text-white tracking-tight italic">Administrative Command</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass-card p-10 rounded-[3rem] border-indigo-500/20 shadow-indigo-500/10">
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Network Users</h3>
          <p className="text-6xl font-black text-white">{users.length}</p>
          <div className="w-12 h-1 bg-indigo-500 mt-6 rounded-full opacity-30"></div>
        </div>
        <div className="glass-card p-10 rounded-[3rem] border-blue-500/20 shadow-blue-500/10">
          <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Total Traffic</h3>
          <p className="text-6xl font-black text-white">{transactions.length}</p>
          <div className="w-12 h-1 bg-blue-500 mt-6 rounded-full opacity-30"></div>
        </div>
        <div className="glass-card p-10 rounded-[3rem] border-emerald-500/20 shadow-emerald-500/10">
          <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">Gross Revenue</h3>
          <p className="text-6xl font-black text-white text-gradient">${totalPayments.toFixed(0)}</p>
          <div className="w-12 h-1 bg-emerald-500 mt-6 rounded-full opacity-30"></div>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden border-white/5 shadow-2xl">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-2xl font-black text-white">Identity Registry</h3>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Scan Active</div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5">
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Index</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Handle</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Protocol Address</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Access Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-10 py-6 text-sm text-gray-500 font-mono">#{u.id}</td>
                <td className="px-10 py-6 font-bold text-white group-hover:text-indigo-400 transition-colors">{u.username}</td>
                <td className="px-10 py-6 text-sm text-gray-400">{u.email}</td>
                <td className="px-10 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.is_staff ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-gray-500'}`}>
                    {u.is_staff ? 'System Admin' : 'Standard User'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { djangoApi } from '../api/api';
import { DownloadIcon } from 'lucide-react';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin based on profile API
    const fetchUser = async () => {
      try {
        const res = await djangoApi.get('/users/profile/');
        setIsAdmin(res.data.is_staff || res.data.is_superuser);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
    fetchTransactions();
  }, [status, dateFrom]);

  const fetchTransactions = async () => {
    try {
      let params = {};
      if (status) params.status = status;
      if (dateFrom) params.date_from = dateFrom;
      const res = await djangoApi.get('/transactions/', { params });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadCSV = () => {
    window.open(`${djangoApi.defaults.baseURL}/transactions/export/`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4 pb-20 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight italic">Transaction Ledger</h2>
          <p className="text-gray-400 font-medium">Detailed record of all encrypted payment flows.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={downloadCSV}
            className="group bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-8 rounded-3xl inline-flex items-center shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
          >
            <DownloadIcon className="w-6 h-6 mr-3 group-hover:bounce" /> Export CSV Draft
          </button>
        )}
      </div>

      <div className="glass-card p-6 rounded-[2.5rem] mb-12 flex flex-wrap gap-8 items-end border-white/5 animate-in fade-in delay-200">
        <div className="flex-1 min-w-[240px]">
          <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Status Classification</label>
          <div className="relative">
            <select 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="" className="bg-slate-900">All Classifications</option>
              <option value="PENDING" className="bg-slate-900">Pending Authorization</option>
              <option value="SUCCESS" className="bg-slate-900">Confirmed Success</option>
              <option value="FAILED" className="bg-slate-900">Rejected / Failed</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Temporal Filter</label>
          <input 
            type="date" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]" 
            value={dateFrom} 
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5">
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Ref ID</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Volume</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Timestamp</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map(txn => (
              <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <span className="font-mono text-sm text-gray-400 group-hover:text-blue-400 transition-colors uppercase select-all">{txn.transaction_id.split('-')[0]}...</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xl font-black text-white decoration-teal-500/30 underline-offset-4 group-hover:underline">${txn.amount}</span>
                  <span className="text-[10px] ml-2 font-bold text-gray-500">{txn.currency}</span>
                </td>
                <td className="px-8 py-6 text-sm text-gray-400 font-medium">
                  {new Date(txn.created_at).toLocaleDateString()} <span className="text-[10px] ml-1 opacity-40">{new Date(txn.created_at).toLocaleTimeString()}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${
                    txn.status === 'SUCCESS' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10' : 
                    txn.status === 'FAILED' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-rose-500/10' : 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-amber-500/10'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${txn.status === 'SUCCESS' ? 'bg-emerald-400' : txn.status === 'FAILED' ? 'bg-rose-400' : 'bg-amber-400'} animate-pulse`}></div>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan="4" className="px-8 py-20 text-center text-gray-500 font-bold uppercase tracking-widest italic">Vault Empty - No Sequences Found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

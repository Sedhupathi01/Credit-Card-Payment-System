import React, { useEffect, useState } from 'react';
import { djangoApi } from '../api/api';
import { DownloadIcon } from 'lucide-react';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
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
  }, [status, dateFrom, minAmount, maxAmount]);

  const fetchTransactions = async () => {
    try {
      let params = {};
      if (status) params.status = status;
      if (dateFrom) params.date_from = dateFrom;
      if (minAmount) params.min_amount = minAmount;
      if (maxAmount) params.max_amount = maxAmount;
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
    <div className="max-w-7xl mx-auto mt-12 px-4 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Transaction Ledger</h2>
          <p className="text-gray-500 font-medium mt-2">Detailed record of all payments.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={downloadCSV}
            className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center shadow-md transition-all active:scale-95 text-sm"
          >
            <DownloadIcon className="w-5 h-5 mr-3 group-hover:bounce" /> Export CSV
          </button>
        )}
      </div>

      <div className="light-card p-6 mb-12 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Status</label>
          <div className="relative">
            <select 
              className="w-full bg-white border border-gray-300 p-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
          </div>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Date</label>
          <input 
            type="date" 
            className="w-full bg-white border border-gray-300 p-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={dateFrom} 
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Min $</label>
          <input 
            type="number" 
            min="0"
            className="w-full bg-white border border-gray-300 p-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={minAmount} 
            onChange={(e) => setMinAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Max $</label>
          <input 
            type="number" 
            min="0"
            className="w-full bg-white border border-gray-300 p-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={maxAmount} 
            onChange={(e) => setMaxAmount(e.target.value)}
            placeholder="1000.00"
          />
        </div>
      </div>

      <div className="light-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ref ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Timestamp</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map(txn => (
              <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-gray-600 uppercase">{txn.transaction_id.split('-')[0]}...</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-gray-800">${txn.amount}</span>
                  <span className="text-xs ml-1 text-gray-500">{txn.currency}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(txn.created_at).toLocaleDateString()} <span className="text-xs ml-1 text-gray-400">{new Date(txn.created_at).toLocaleTimeString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase rounded-full border ${
                    txn.status === 'SUCCESS' ? 'bg-green-50 border-green-200 text-green-700' : 
                    txn.status === 'FAILED' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${txn.status === 'SUCCESS' ? 'bg-green-500' : txn.status === 'FAILED' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium">No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

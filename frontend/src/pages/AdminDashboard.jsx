import React, { useEffect, useState } from 'react';
import { djangoApi } from '../api/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);

  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersRes = await djangoApi.get('/users/');
        setUsers(usersRes.data);
        
        const cardsRes = await djangoApi.get('/cards/');
        setCards(cardsRes.data);
        
        const transRes = await djangoApi.get('/transactions/');
        setTransactions(transRes.data);
        setFilteredTxns(transRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdminData();
  }, []);

  const handleApplyFilter = () => {
    let filtered = transactions;
    if (dateFrom) {
      filtered = filtered.filter(t => t.created_at.startsWith(dateFrom));
    }
    if (minAmount) {
      filtered = filtered.filter(t => parseFloat(t.amount) >= parseFloat(minAmount));
    }
    if (status) {
      filtered = filtered.filter(t => t.status.toUpperCase() === status.toUpperCase());
    }
    setFilteredTxns(filtered);
  };

  const handleExportCSV = () => {
    window.open(`${djangoApi.defaults.baseURL}/transactions/export/`, '_blank');
  };

  // Stats Logic
  const totalTransactions = filteredTxns.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = filteredTxns.filter(t => t.created_at.startsWith(todayStr)).length;
  
  const paymentSuccess = filteredTxns.filter(t => t.status === 'SUCCESS').length;
  const paymentFailed = filteredTxns.filter(t => t.status === 'FAILED').length;
  
  const totalCards = cards.length;
  const activeCards = cards.length; 
  const blockedCards = 0; 
  
  const monthlyRevenue = filteredTxns.reduce((acc, curr) => curr.status === 'SUCCESS' ? acc + parseFloat(curr.amount) : acc, 0);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-serif bg-[#f6f6f6]">
      {/* Top Black Bar */}
      <div className="bg-black text-white px-6 py-3 border-b-8 border-gray-200 flex items-center">
        <span className="text-xl mr-2">💳</span>
        <h1 className="text-xl font-bold tracking-wide">Credit Card Manager - Dashboard</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-[#1a1a1a] text-white p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-gray-300 font-bold mb-6 text-sm">Menu</h3>
            <ul className="space-y-6 text-sm font-semibold">
              <li className="flex items-center gap-3 cursor-pointer hover:text-blue-300"><span className="text-purple-400">👤</span> Users</li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-blue-300"><span className="text-blue-400">💳</span> Cards</li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-blue-300"><span className="text-yellow-500">💰</span> Transactions</li>
            </ul>
          </div>
          <button 
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm flex items-center gap-2 mt-10"
          >
            📋 Export CSV
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto w-full max-w-[1200px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            👋 Welcome Back, Admin
          </h2>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-blue-600 text-sm font-bold w-full md:w-auto">
              <span>🔍</span> Filter Transactions
            </div>
            
            <input 
              type="date" 
              className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-black"
              value={dateFrom}
              onChange={(e)=>setDateFrom(e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Min Amount"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-black w-32"
              value={minAmount}
              onChange={(e)=>setMinAmount(e.target.value)}
            />
            <select 
              className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-black bg-white"
              value={status}
              onChange={(e)=>setStatus(e.target.value)}
            >
              <option value="">Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
            <button 
              onClick={handleApplyFilter}
              className="bg-black text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-gray-800"
            >
              Apply Filter
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total Transactions" value={totalTransactions} />
            <StatCard title="Today Transactions" value={todayTransactions} />
            <StatCard title="Payment Success" value={paymentSuccess} />
            <StatCard title="Payment Failed" value={paymentFailed} />
            <StatCard title="Total Cards" value={totalCards} />
            <StatCard title="Active Cards" value={activeCards} />
            <StatCard title="Blocked Cards" value={blockedCards} />
            <StatCard title="Monthly Revenue" value={`₹ ${monthlyRevenue.toFixed(0)}`} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[200px]">
             <h3 className="font-bold text-gray-800 flex items-center gap-2"><span className="text-blue-500">📊</span> Revenue Analytics</h3>
          </div>
        </div>
      </div>
      
      {/* Return to frontend button so they can still access site */}
      <button 
        onClick={() => window.location.href = "/dashboard"}
        className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-full shadow-2xl opacity-50 hover:opacity-100 transition-opacity"
      >
        Exit Admin
      </button>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
      <h4 className="text-sm font-bold text-gray-800 mb-6">{title}</h4>
      <p className="text-3xl font-black text-black">{value}</p>
    </div>
  );
}

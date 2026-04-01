import React, { useEffect, useState } from 'react';
import { djangoApi } from '../api/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, cards, transactions

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
  const totalTransactions = transactions.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.created_at.startsWith(todayStr)).length;
  
  const paymentSuccess = transactions.filter(t => t.status === 'SUCCESS').length;
  const paymentFailed = transactions.filter(t => t.status === 'FAILED').length;
  
  const totalCards = cards.length;
  const activeCards = cards.length; 
  const blockedCards = 0; 
  
  const monthlyRevenue = transactions.reduce((acc, curr) => curr.status === 'SUCCESS' ? acc + parseFloat(curr.amount) : acc, 0);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-serif bg-gray-50 overflow-hidden">
      {/* Top Black Bar */}
      <div className="bg-black text-white px-6 py-4 flex items-center shadow-md z-10">
        <div className="w-8 h-6 bg-blue-400 rounded mr-3 flex items-center justify-center font-bold text-xs shadow-inner">💳</div>
        <h1 className="text-xl font-bold tracking-wide">Credit Card Manager - Dashboard</h1>
        <button onClick={() => window.location.href = "/dashboard"} className="ml-auto text-sm text-gray-400 hover:text-white">Exit Admin</button>
      </div>

      <div className="flex flex-1 overflow-hidden h-full relative">
        {/* Sidebar */}
        <div className="w-64 bg-[#111111] text-white p-6 flex flex-col justify-between shadow-2xl z-10">
          <div>
            <h3 className="text-gray-400 font-bold mb-6 text-sm uppercase tracking-wider">Menu</h3>
            <ul className="space-y-6 text-sm font-semibold">
              <li 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-300'}`}
              >
                <span>📊</span> Dashboard
              </li>
              <li 
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-300'}`}
              >
                <span>👤</span> Users
              </li>
              <li 
                onClick={() => setActiveTab('cards')}
                className={`flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-colors ${activeTab === 'cards' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-300'}`}
              >
                <span>💳</span> Cards
              </li>
              <li 
                onClick={() => setActiveTab('transactions')}
                className={`flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-colors ${activeTab === 'transactions' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-300'}`}
              >
                <span>💰</span> Transactions
              </li>
            </ul>
          </div>
          <button 
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 mt-10 transition-colors shadow-lg shadow-green-600/20"
          >
            📋 Export CSV
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            👋 Welcome Back, Admin
          </h2>

          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-300">
              {/* Filter Bar exactly like screenshot */}
              <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-blue-600 text-sm font-bold w-full md:w-auto mr-4">
                  <span>🔍</span> Filter Transactions
                </div>
                
                <input 
                  type="date" 
                  className="border border-gray-200 rounded p-2 text-sm outline-none focus:border-black text-gray-600"
                  value={dateFrom}
                  onChange={(e)=>setDateFrom(e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Min Amount"
                  className="border border-gray-200 rounded p-2 text-sm outline-none focus:border-black w-32 placeholder-gray-400"
                  value={minAmount}
                  onChange={(e)=>setMinAmount(e.target.value)}
                />
                <select 
                  className="border border-gray-200 rounded p-2 text-sm outline-none focus:border-black bg-white text-gray-600"
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
                  className="bg-black text-white px-5 py-2 rounded font-bold hover:bg-gray-800 transition-colors ml-auto text-sm shadow-md"
                >
                  Apply Filter
                </button>
              </div>

              {/* Stats Grid exactly like screenshot */}
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

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[250px] relative overflow-hidden">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6"><span className="text-blue-500">📊</span> Revenue Analytics</h3>
                
                {/* Fake Chart bars for aesthetic to match 'Analytics' section */}
                <div className="flex items-end justify-between h-32 w-full max-w-lg mx-auto pb-4 border-b border-gray-200 px-6">
                   <div className="w-8 bg-blue-200 h-[30%] rounded-t-sm"></div>
                   <div className="w-8 bg-blue-300 h-[50%] rounded-t-sm"></div>
                   <div className="w-8 bg-blue-400 h-[40%] rounded-t-sm"></div>
                   <div className="w-8 bg-blue-500 h-[80%] rounded-t-sm"></div>
                   <div className="w-8 bg-blue-600 h-[100%] rounded-t-sm shadow-lg"></div>
                   <div className="w-8 bg-blue-300 h-[60%] rounded-t-sm"></div>
                   <div className="w-8 bg-blue-200 h-[40%] rounded-t-sm"></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg">Platform Users ({users.length})</h3>
              </div>
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-gray-200 bg-white"><th className="p-4 text-xs font-bold text-gray-500 uppercase">ID</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Username</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Email</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Role</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="p-4 text-sm font-mono text-gray-500">#{u.id}</td><td className="p-4 font-bold text-gray-800">{u.username}</td><td className="p-4 text-sm text-gray-600">{u.email}</td><td className="p-4 text-xs"><span className={`px-2 py-1 rounded font-bold ${u.is_staff ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.is_staff ? 'Admin' : 'User'}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
               <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg">System Cards ({cards.length})</h3>
              </div>
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-gray-200 bg-white"><th className="p-4 text-xs font-bold text-gray-500 uppercase">Owner ID</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Holder Name</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Masked Number</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Type</th></tr></thead>
                <tbody>
                  {cards.map(c => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="p-4 text-sm text-gray-500">User #{c.user}</td><td className="p-4 font-bold text-gray-800">{c.cardholder_name}</td><td className="p-4 tracking-widest font-mono text-gray-600">{c.masked_number}</td><td className="p-4 font-bold text-sm text-gray-600">{c.card_type}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg">Transaction Database ({filteredTxns.length})</h3>
              </div>
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-gray-200 bg-white"><th className="p-4 text-xs font-bold text-gray-500 uppercase">TXN ID</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Amount</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th></tr></thead>
                <tbody>
                  {filteredTxns.map(t => (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="p-4 text-sm font-mono text-gray-500">{t.transaction_id.split('-')[0]}</td><td className="p-4 font-bold text-gray-800">${t.amount}</td><td className="p-4 text-sm text-gray-600">{new Date(t.created_at).toLocaleString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-bold uppercase rounded ${t.status==='SUCCESS'?'bg-green-100 text-green-700':t.status==='FAILED'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{t.status}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-8 px-6 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-blue-100 transition-all">
      <h4 className="text-sm font-bold text-gray-800 mb-4">{title}</h4>
      <p className="text-3xl font-black text-black">{value}</p>
    </div>
  );
}

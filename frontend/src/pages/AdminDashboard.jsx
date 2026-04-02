import React, { useEffect, useState } from 'react';
import { djangoApi } from '../api/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

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
    <div className="max-w-7xl mx-auto mt-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Menu matching Frontend Light Theme */}
        <div className="w-full md:w-64 light-card p-6 flex flex-col justify-between h-auto md:min-h-[600px]">
          <div>
            <h3 className="text-gray-500 font-bold mb-6 text-sm uppercase tracking-wider border-b pb-2">Admin Menu</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-700">
              <li 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 cursor-pointer py-3 px-4 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'hover:bg-gray-100 border-l-4 border-transparent'}`}
              >
                <span>📊</span> Overview
              </li>
              <li 
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-3 cursor-pointer py-3 px-4 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'hover:bg-gray-100 border-l-4 border-transparent'}`}
              >
                <span>👤</span> Manage Users
              </li>
              <li 
                onClick={() => setActiveTab('cards')}
                className={`flex items-center gap-3 cursor-pointer py-3 px-4 rounded-lg transition-colors ${activeTab === 'cards' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'hover:bg-gray-100 border-l-4 border-transparent'}`}
              >
                <span>💳</span> Vault Cards
              </li>
              <li 
                onClick={() => setActiveTab('transactions')}
                className={`flex items-center gap-3 cursor-pointer py-3 px-4 rounded-lg transition-colors ${activeTab === 'transactions' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'hover:bg-gray-100 border-l-4 border-transparent'}`}
              >
                <span>💰</span> Transactions
              </li>
            </ul>
          </div>
          <button 
            onClick={handleExportCSV}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 mt-8 transition-colors shadow-md"
          >
            📋 Export CSV
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Admin Console
          </h2>

          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-300">
              {/* Filter Bar */}
              <div className="light-card p-5 mb-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-blue-600 text-sm font-bold w-full lg:w-auto mr-4">
                  <span>🔍</span> Filter Data
                </div>
                
                <input 
                  type="date" 
                  className="border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500 text-gray-700"
                  value={dateFrom}
                  onChange={(e)=>setDateFrom(e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Min $"
                  className="border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500 w-24 placeholder-gray-400 text-gray-700"
                  value={minAmount}
                  onChange={(e)=>setMinAmount(e.target.value)}
                />
                <select 
                  className="border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-700 w-32"
                  value={status}
                  onChange={(e)=>setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                  <option value="PENDING">Pending</option>
                </select>
                <button 
                  onClick={handleApplyFilter}
                  className="bg-blue-600 text-white px-5 py-2 rounded font-bold hover:bg-blue-700 transition-colors ml-auto text-sm shadow-sm"
                >
                  Apply
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total TXNs" value={totalTransactions} />
                <StatCard title="Today TXNs" value={todayTransactions} />
                <StatCard title="Successful" value={paymentSuccess} />
                <StatCard title="Failed" value={paymentFailed} />
                <StatCard title="Total Cards" value={totalCards} />
                <StatCard title="Active Cards" value={activeCards} />
                <StatCard title="Blocked Cards" value={blockedCards} />
                <StatCard title="Monthly Rev" value={`$${monthlyRevenue.toFixed(0)}`} />
              </div>

              <div className="light-card p-6 min-h-[250px] relative overflow-hidden flex flex-col justify-between">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6 border-b pb-4"><span className="text-blue-500">📊</span> Revenue Analytics Projection</h3>
                
                {filteredTxns.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <span className="text-5xl mb-3">📉</span>
                    <p className="font-bold text-sm tracking-widest uppercase">Insufficient Data</p>
                    <p className="text-xs">No transactions available to analyze.</p>
                  </div>
                ) : (
                  <div className="flex items-end justify-between h-32 w-full max-w-lg mx-auto pb-2 border-b-2 border-gray-100 px-6">
                     <div className="w-8 bg-blue-100 h-[30%] rounded-t-sm hover:h-[35%] transition-all"></div>
                     <div className="w-8 bg-blue-200 h-[50%] rounded-t-sm hover:h-[55%] transition-all"></div>
                     <div className="w-8 bg-blue-300 h-[40%] rounded-t-sm hover:h-[45%] transition-all"></div>
                     <div className="w-8 bg-blue-400 h-[80%] rounded-t-sm hover:h-[85%] transition-all"></div>
                     <div className="w-8 bg-blue-600 h-[100%] rounded-t-sm shadow-sm hover:h-[95%] transition-all relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 font-bold transition-opacity">Peak</span></div>
                     <div className="w-8 bg-blue-300 h-[60%] rounded-t-sm hover:h-[65%] transition-all"></div>
                     <div className="w-8 bg-blue-200 h-[40%] rounded-t-sm hover:h-[45%] transition-all"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="light-card overflow-hidden animate-in fade-in duration-300">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg">Platform Users ({users.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b border-gray-200 bg-white"><th className="p-4 text-xs font-bold text-gray-500 uppercase">ID</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Username</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Email</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Role</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 text-sm font-mono text-gray-500">#{u.id}</td><td className="p-4 font-bold text-gray-800">{u.username}</td><td className="p-4 text-sm text-gray-600">{u.email}</td><td className="p-4 text-xs"><span className={`px-2 py-1 rounded font-bold ${u.is_staff ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>{u.is_staff ? 'Admin' : 'User'}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="light-card overflow-hidden animate-in fade-in duration-300">
               <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg">System Vault Cards ({cards.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b border-gray-200 bg-white"><th className="p-4 text-xs font-bold text-gray-500 uppercase">Owner ID</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Holder Name</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Masked Number</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Type</th></tr></thead>
                  <tbody>
                    {cards.map(c => (
                      <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 text-sm text-gray-500">User #{c.user}</td><td className="p-4 font-bold text-gray-800">{c.cardholder_name}</td><td className="p-4 tracking-widest font-mono text-gray-600">{c.masked_number}</td><td className="p-4 font-bold text-sm text-gray-600">{c.card_type}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="light-card overflow-hidden animate-in fade-in duration-300">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg">Transaction Database ({filteredTxns.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b border-gray-200 bg-white"><th className="p-4 text-xs font-bold text-gray-500 uppercase">TXN ID</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Amount</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th></tr></thead>
                  <tbody>
                    {filteredTxns.map(t => (
                      <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 text-sm font-mono text-gray-500">{t.transaction_id.split('-')[0]}</td><td className="p-4 font-bold text-gray-800">${t.amount}</td><td className="p-4 text-sm text-gray-600">{new Date(t.created_at).toLocaleString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-bold uppercase rounded border ${t.status==='SUCCESS'?'bg-green-50 text-green-700 border-green-200':t.status==='FAILED'?'bg-red-50 text-red-700 border-red-200':'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{t.status}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="light-card py-6 px-4 flex flex-col items-center justify-center text-center">
      <h4 className="text-sm font-bold text-gray-500 mb-2">{title}</h4>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  );
}

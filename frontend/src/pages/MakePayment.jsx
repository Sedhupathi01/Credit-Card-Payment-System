import React, { useState, useEffect } from 'react';
import { djangoApi, fastapiApi } from '../api/api';

export default function MakePayment() {
  const [cards, setCards] = useState([]);
  const [amount, setAmount] = useState('');
  const [selectedCardId, setSelectedCardId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await djangoApi.get('/cards/');
        setCards(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCards();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        amount: parseFloat(amount),
        currency: 'USD',
        card_id: selectedCardId ? parseInt(selectedCardId) : null
      };

      const res = await fastapiApi.post('/payments/process', payload);
      setMessage(`Payment Status: ${res.data.status} - ${res.data.message}`);
      setAmount('');
      setSelectedCardId('');
    } catch (err) {
      setMessage(`Payment Error: ${err.response?.data?.detail || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 animate-in zoom-in duration-500">
      <div className="glass-card p-12 rounded-[3.5rem] w-full max-w-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 blur-[80px] opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 blur-[80px] opacity-30"></div>

        <h2 className="text-4xl font-black mb-2 text-white italic tracking-tighter">Instant Transfer</h2>
        <p className="text-gray-400 mb-10 font-medium">Verify your amount and select your funding source.</p>

        {message && (
          <div className={`p-5 mb-8 rounded-2xl border font-bold flex items-center gap-3 animate-bounce ${message.includes('SUCCESS') || message.includes('successfully') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
            <div className={`w-2 h-2 rounded-full ${message.includes('SUCCESS') || message.includes('successfully') ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-rose-400 shadow-[0_0_10px_#fb7185]'}`}></div>
            {message}
          </div>
        )}
        
        <form onSubmit={handlePayment} className="space-y-8">
          <div>
            <label className="block text-sm font-black text-gray-300 mb-3 ml-1 uppercase tracking-widest opacity-60">Funding Asset</label>
            <div className="relative">
              <select 
                className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                value={selectedCardId} 
                onChange={e=>setSelectedCardId(e.target.value)}
              >
                <option value="" className="bg-slate-900">Direct Account Balance</option>
                {cards.map(card => (
                  <option key={card.id} value={card.id} className="bg-slate-900">
                    {card.card_type} •••• {card.last_4_digits}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-gray-300 mb-3 ml-1 uppercase tracking-widest opacity-60">Payment Amount</label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-600 group-focus-within:text-purple-500 transition-colors">$</span>
              <input 
                className="w-full bg-white/5 border border-white/10 pl-14 pr-8 py-8 rounded-[2.5rem] text-5xl font-black text-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all placeholder:text-white/5 text-center" 
                type="number" 
                step="0.01"
                min="1"
                value={amount} 
                onChange={e=>setAmount(e.target.value)} 
                placeholder="0.00"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full font-black py-6 rounded-[2.5rem] transition-all text-xl shadow-2xl active:scale-95 flex items-center justify-center gap-3 ${loading ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20'}`}
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : 'Authorize Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}

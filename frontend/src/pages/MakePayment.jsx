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
    <div className="flex items-center justify-center min-h-[80vh] px-4 animate-in fade-in duration-500">
      <div className="light-card p-10 w-full max-w-xl shadow-lg relative overflow-hidden bg-white">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Make Payment</h2>
        <p className="text-gray-500 mb-8 font-medium">Verify your amount and select your funding source.</p>

        {message && (
          <div className={`p-4 mb-8 rounded-lg border font-bold flex items-center gap-3 ${message.includes('SUCCESS') || message.includes('successfully') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            <div className={`w-2 h-2 rounded-full ${message.includes('SUCCESS') || message.includes('successfully') ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {message}
          </div>
        )}
        
        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2 uppercase">Funding Asset</label>
            <div className="relative">
              <select 
                className="w-full bg-white border border-gray-300 p-4 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                value={selectedCardId} 
                onChange={e=>setSelectedCardId(e.target.value)}
              >
                <option value="">Direct Account Balance</option>
                {cards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.card_type} •••• {card.last_4_digits}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2 uppercase">Payment Amount</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400 group-focus-within:text-blue-500 transition-colors">$</span>
              <input 
                className="w-full bg-white border border-gray-300 pl-12 pr-6 py-5 rounded-lg text-3xl font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-300" 
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
            className={`w-full font-bold py-4 rounded-lg transition-all text-lg flex items-center justify-center gap-3 ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Processing...
              </>
            ) : 'Authorize Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}

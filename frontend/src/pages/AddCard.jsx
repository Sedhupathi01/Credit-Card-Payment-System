import React, { useState, useEffect } from 'react';
import { djangoApi } from '../api/api';

export default function AddCard() {
  const [cards, setCards] = useState([]);
  const [cardholder_name, setCardholderName] = useState('');
  const [card_number, setCardNumber] = useState('');
  const [card_type, setCardType] = useState('CREDIT');
  const [expiry_month, setExpiryMonth] = useState('');
  const [expiry_year, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  const fetchCards = async () => {
    try {
      const res = await djangoApi.get('/cards/');
      setCards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await djangoApi.post('/cards/', {
        cardholder_name,
        card_number,
        card_type,
        expiry_month,
        expiry_year,
        cvv
      });
      fetchCards();
      // Reset form
      setCardholderName(''); setCardNumber(''); setExpiryMonth(''); setExpiryYear(''); setCvv('');
    } catch (err) {
      alert("Error adding card. Please check details.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await djangoApi.delete(`/cards/${id}/`);
      fetchCards();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4 pb-12 animate-in slide-in-from-bottom duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <h2 className="text-4xl font-black mb-8 text-white tracking-tight">Add New Asset</h2>
          <form onSubmit={handleSubmit} className="glass-card p-10 rounded-[3rem] space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Cardholder Name</label>
              <input className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" type="text" value={cardholder_name} onChange={e=>setCardholderName(e.target.value)} placeholder="JOHN R DOE" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Card Number</label>
              <input className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono tracking-widest" type="text" value={card_number} onChange={e=>setCardNumber(e.target.value)} maxLength="16" minLength="13" placeholder="0000 0000 0000 0000" required />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Expiry Month</label>
                <input className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" type="text" value={expiry_month} onChange={e=>setExpiryMonth(e.target.value)} maxLength="2" placeholder="MM" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Expiry Year</label>
                <input className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" type="text" value={expiry_year} onChange={e=>setExpiryYear(e.target.value)} maxLength="4" placeholder="YYYY" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">CVV</label>
                <input className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" type="password" value={cvv} onChange={e=>setCvv(e.target.value)} maxLength="4" minLength="3" placeholder="•••" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Card Type</label>
                <select className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none" value={card_type} onChange={e=>setCardType(e.target.value)}>
                  <option value="CREDIT" className="bg-slate-800">Credit Card</option>
                  <option value="DEBIT" className="bg-slate-800">Debit Card</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-lg">
              Link Securely
            </button>
          </form>
        </div>

        <div className="lg:col-span-7">
          <h2 className="text-4xl font-black mb-8 text-white tracking-tight flex items-center justify-between">
            Active Vault 
            <span className="text-sm font-bold text-gray-400 bg-white/5 px-4 py-1 rounded-full">{cards.length} Total</span>
          </h2>
          {cards.length === 0 ? (
            <div className="glass-card p-20 rounded-[3rem] text-center border-dashed border-2 border-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500 italic text-3xl">?</div>
              <p className="text-gray-500 font-bold text-xl uppercase tracking-widest">No assets found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cards.map((card, idx) => (
                <div key={card.id} className={`p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden h-64 flex flex-col justify-between transition-all hover:-translate-y-2 cursor-pointer active:scale-95 ${idx % 3 === 0 ? 'bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500' : idx % 3 === 1 ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500' : 'bg-gradient-to-br from-teal-600 via-emerald-600 to-lime-500'}`}>
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 rounded-full border-4 border-white opacity-10"></div>
                  </div>

                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Financial Service</p>
                      <span className="text-xl font-black italic">{card.card_type}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); handleDelete(card.id); }} 
                      className="bg-white/20 hover:bg-red-500 p-2.5 rounded-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all font-bold"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>

                  <div className="relative z-10">
                    <div className="text-2xl font-bold tracking-[0.25em] mb-4 drop-shadow-md">{card.masked_number}</div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Holder</p>
                        <span className="font-bold tracking-tight text-sm">{card.cardholder_name.toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Expires</p>
                        <span className="font-bold tracking-tight text-sm">{card.expiry_month}/{card.expiry_year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
    <div className="max-w-7xl mx-auto mt-12 px-4 pb-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Card</h2>
          <form onSubmit={handleSubmit} className="light-card p-8 space-y-5 bg-white">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Cardholder Name</label>
              <input className="w-full bg-white border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500" type="text" value={cardholder_name} onChange={e=>setCardholderName(e.target.value)} placeholder="JOHN R DOE" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Card Number</label>
              <input className="w-full bg-white border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono tracking-widest" type="text" value={card_number} onChange={e=>setCardNumber(e.target.value)} maxLength="16" minLength="13" placeholder="0000 0000 0000 0000" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Expiry Month</label>
                <input className="w-full bg-white border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500" type="text" value={expiry_month} onChange={e=>setExpiryMonth(e.target.value)} maxLength="2" placeholder="MM" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Expiry Year</label>
                <input className="w-full bg-white border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500" type="text" value={expiry_year} onChange={e=>setExpiryYear(e.target.value)} maxLength="4" placeholder="YYYY" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">CVV</label>
                <input className="w-full bg-white border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500" type="password" value={cvv} onChange={e=>setCvv(e.target.value)} maxLength="4" minLength="3" placeholder="•••" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Card Type</label>
                <select className="w-full bg-white border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none" value={card_type} onChange={e=>setCardType(e.target.value)}>
                  <option value="CREDIT">Credit Card</option>
                  <option value="DEBIT">Debit Card</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mt-4 rounded-lg shadow-sm transition-colors text-lg">
              Add Asset
            </button>
          </form>
        </div>

        <div className="lg:col-span-7">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center justify-between">
            Active Vault 
            <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{cards.length} Total</span>
          </h2>
          {cards.length === 0 ? (
            <div className="light-card p-20 text-center border-dashed border-2 border-gray-200 bg-white">
              <p className="text-gray-400 font-bold text-lg uppercase">No cards found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map((card, idx) => (
                <div key={card.id} className="p-6 rounded-xl shadow-md relative group flex flex-col justify-between transition-all bg-gradient-to-br from-gray-800 to-gray-900 text-white h-56">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Financial Service</p>
                      <span className="text-lg font-bold">{card.card_type}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); handleDelete(card.id); }} 
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>

                  <div>
                    <div className="text-xl font-bold tracking-[0.2em] mb-4 font-mono">{card.masked_number}</div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cardholder</p>
                        <span className="font-bold text-sm tracking-wide">{card.cardholder_name.toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Expires</p>
                        <span className="font-bold text-sm">{card.expiry_month}/{card.expiry_year}</span>
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

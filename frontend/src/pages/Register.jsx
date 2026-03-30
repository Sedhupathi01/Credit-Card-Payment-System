import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { djangoApi } from '../api/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await djangoApi.post('/users/register/', { username, email, password });
      navigate('/login');
    } catch (err) {
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="glass-card p-10 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500"></div>

        <h2 className="text-4xl font-black mb-2 text-white">Create Account</h2>
        <p className="text-gray-400 mb-8">Join our secure fintech ecosystem today.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Username</label>
            <input 
              className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-gray-600" 
              type="text" 
              placeholder="e.g. johndoe"
              value={username} 
              onChange={e=>setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Email Address</label>
            <input 
              className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-gray-600" 
              type="email" 
              placeholder="e.g. john@example.com"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Password</label>
            <input 
              className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-gray-600" 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-95"
          >
            Create Free Account
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 font-medium">
          Already have an account? <a href="/login" className="text-teal-400 hover:underline">Log in instead</a>
        </div>
      </div>
    </div>
  );
}

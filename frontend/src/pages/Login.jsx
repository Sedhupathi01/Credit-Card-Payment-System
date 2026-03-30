import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { djangoApi } from '../api/api';
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await djangoApi.post('/users/login/', { email, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      // Optional decode logic
      // const decoded = jwtDecode(res.data.access);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="glass-card p-10 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <h2 className="text-4xl font-black mb-2 text-white">Welcome Back</h2>
        <p className="text-gray-400 mb-8">Please enter your details to sign in.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Email Address</label>
            <input 
              className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600" 
              type="email" 
              placeholder="e.g. user@example.com"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Password</label>
            <input 
              className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600" 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 font-medium">
          New here? <a href="/register" className="text-blue-400 hover:underline">Create an account</a>
        </div>
      </div>
    </div>
  );
}

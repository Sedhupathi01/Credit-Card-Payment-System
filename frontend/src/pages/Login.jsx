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
      <div className="light-card p-10 w-full max-w-md shadow-lg bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
        
        <h2 className="text-3xl font-bold mb-2 text-gray-800 text-center">Sign In</h2>
        <p className="text-gray-500 mb-8 text-center text-sm">Access your credit operations account.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input 
              className="w-full bg-white border border-gray-300 px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400" 
              type="email" 
              placeholder="user@example.com"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              className="w-full bg-white border border-gray-300 px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400" 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mt-4 rounded-md transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account? <a href="/register" className="text-blue-600 hover:text-blue-800 font-bold hover:underline">Register</a>
        </div>
      </div>
    </div>
  );
}

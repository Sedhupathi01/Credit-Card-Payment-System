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
      <div className="light-card p-10 w-full max-w-md shadow-lg bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-600"></div>

        <h2 className="text-3xl font-bold mb-2 text-gray-800 text-center">Create Account</h2>
        <p className="text-gray-500 mb-8 text-center text-sm">Join our secure fintech ecosystem today.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input 
              className="w-full bg-white border border-gray-300 px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400" 
              type="text" 
              placeholder="e.g. johndoe"
              value={username} 
              onChange={e=>setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input 
              className="w-full bg-white border border-gray-300 px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400" 
              type="email" 
              placeholder="e.g. john@example.com"
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 mt-4 rounded-md transition-colors"
          >
            Create Free Account
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-800 font-bold hover:underline">Log in instead</a>
        </div>
      </div>
    </div>
  );
}

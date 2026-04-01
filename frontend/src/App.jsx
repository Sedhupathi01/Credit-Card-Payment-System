import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddCard from './pages/AddCard';
import MakePayment from './pages/MakePayment';
import TransactionHistory from './pages/TransactionHistory';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
  const token = localStorage.getItem('access_token');

  return (
    <Router>
      <div className="relative min-h-screen">
        {/* Background Blobs for extra flourish */}
        <div className="blob-bg w-[500px] h-[500px] bg-blue-600 top-[-100px] left-[-100px] opacity-20"></div>
        <div className="blob-bg w-[400px] h-[400px] bg-purple-600 bottom-[-50px] right-[-50px] opacity-20 delay-1000"></div>
        <div className="blob-bg w-[300px] h-[300px] bg-teal-500 top-[20%] right-[10%] opacity-10"></div>

        {token && <Navbar />}
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/add-card" element={token ? <AddCard /> : <Navigate to="/login" />} />
            <Route path="/make-payment" element={token ? <MakePayment /> : <Navigate to="/login" />} />
            <Route path="/transactions" element={token ? <TransactionHistory /> : <Navigate to="/login" />} />
            <Route path="/admin-dashboard" element={token ? <AdminDashboard /> : <Navigate to="/login" />} />
            
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

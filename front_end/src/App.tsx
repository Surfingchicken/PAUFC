import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import AppContent from './AppContent';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import HomePage from './components/home/HomePage';
import './styles/App.css';
import Donations from './components/bills/Donations';


const App: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/app" element={token ? <AppContent /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

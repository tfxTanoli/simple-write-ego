import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import HumanizerTool from './pages/HumanizerTool';
import HistoryPage from './pages/HistoryPage';
import PricingPage from './pages/PricingPage';
import SettingsPage from './pages/SettingsPage';
import EthicsPage from './pages/EthicsPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CheckoutPage from './pages/CheckoutPage';
import { getUser } from './services/storageService';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const refreshUser = () => {
    const updated = getUser();
    setUser(updated);
  };

  const handleAppRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <Router>
      <Layout 
        key={refreshKey} 
        user={user} 
        setUser={setUser} 
        theme={theme} 
        toggleTheme={toggleTheme}
        onRefresh={handleAppRefresh}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage user={user} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/tool" element={<HumanizerTool user={user} onUserUpdate={refreshUser} />} />
          <Route path="/ethics" element={<EthicsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          <Route 
            path="/login" 
            element={!user ? <AuthPage setUser={setUser} mode="login" /> : <Navigate to="/app" />} 
          />
          <Route 
            path="/signup" 
            element={!user ? <AuthPage setUser={setUser} mode="signup" /> : <Navigate to="/app" />} 
          />

          {/* User Protected Routes */}
          <Route 
            path="/app" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/app/humanizer" 
            element={user ? <HumanizerTool user={user} onUserUpdate={refreshUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/app/history" 
            element={user ? <HistoryPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/app/pricing" 
            element={user ? <PricingPage user={user} onPlanUpdate={refreshUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/app/settings" 
            element={user ? <SettingsPage user={user} onUserUpdate={refreshUser} /> : <Navigate to="/login" />} 
          />
          
          {/* Checkout Route */}
          <Route 
            path="/checkout" 
            element={user ? <CheckoutPage user={user} onPlanUpdate={refreshUser} /> : <Navigate to="/login" />} 
          />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
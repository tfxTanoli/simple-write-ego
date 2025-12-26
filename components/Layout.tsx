import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PenTool,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  CreditCard,
  User as UserIcon,
  Sun,
  Moon,
  Twitter,
  Github,
  Linkedin,
  Shield
} from 'lucide-react';
import { User } from '../types';
import { logoutUser } from '../services/storageService';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  setUser: (user: User | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onRefresh: () => void;
  onLogout: () => Promise<void>;
}

const Layout: React.FC<LayoutProps> = ({ children, user, setUser, theme, toggleTheme, onRefresh, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPublicPage = !user || (['/', '/login', '/signup', '/pricing', '/tool', '/ethics', '/blog', '/about', '/privacy', '/terms'].includes(location.pathname) && !location.pathname.startsWith('/app'));

  const handleLogout = async () => {
    await onLogout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );

  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div onClick={handleLogoClick} className="flex items-center cursor-pointer group">
                <Sparkles className="h-8 w-8 text-brand-600 mr-2 group-hover:rotate-12 transition-transform" />
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">SimpleWriteGO</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 font-medium transition">Home</Link>
                <Link to="/pricing" className="text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 font-medium transition">Pricing</Link>
                <ThemeToggle />
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 font-medium transition flex items-center">
                    <Shield className="h-4 w-4 mr-1" /> Admin
                  </Link>
                )}
                {user ? (
                  <Link to="/app" className="bg-brand-600 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20 flex items-center">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="h-6 w-6 rounded-full mr-2 object-cover border border-brand-400" />
                    ) : (
                      <UserIcon className="h-4 w-4 mr-2" />
                    )}
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="text-slate-900 dark:text-white font-medium hover:text-brand-600 dark:hover:text-brand-400 transition">Sign in</Link>
                    <Link to="/signup" className="bg-brand-600 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20">
                      Sign up Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-1">
                <div onClick={handleLogoClick} className="flex items-center cursor-pointer mb-4">
                  <Sparkles className="h-6 w-6 text-brand-600 mr-2" />
                  <span className="font-bold text-lg text-slate-900 dark:text-white">SimpleWriteGO</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                  Making AI content sound human. Advanced rewriting technology for students, writers, and professionals.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"><Twitter className="h-5 w-5" /></a>
                  <a href="#" className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"><Github className="h-5 w-5" /></a>
                  <a href="#" className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"><Linkedin className="h-5 w-5" /></a>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Features</Link></li>
                  <li><Link to="/pricing" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Pricing</Link></li>
                  <li><Link to="/tool" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Humanizer Tool</Link></li>
                  <li><Link to="/login" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Login</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition">About Us</Link></li>
                  <li><Link to="/blog" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Blog</Link></li>
                  <li><Link to="/ethics" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Ethics Policy</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link to="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-500 dark:text-slate-500 text-sm">
                © {new Date().getFullYear()} SimpleWriteGo. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="flex items-center text-xs text-slate-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Systems Normal
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const isActive = (path: string) => location.pathname === path
    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-700 cursor-pointer">
            <div onClick={handleLogoClick} className="flex items-center group">
              <Sparkles className="h-6 w-6 text-brand-600 mr-2 group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-lg text-slate-900 dark:text-white">SimpleWriteGO</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500"><X size={20} /></button>
          </div>

          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">

            <div className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">User Menu</div>
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/admin/dashboard')}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Shield className="h-5 w-5 mr-3 text-indigo-500" />
                Admin Panel
              </Link>
            )}
            <Link to="/app" className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/app')}`} onClick={() => setIsMobileMenuOpen(false)}>
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/app/humanizer" className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/app/humanizer')}`} onClick={() => setIsMobileMenuOpen(false)}>
              <PenTool className="h-5 w-5 mr-3" /> Write
            </Link>
            <Link to="/app/history" className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/app/history')}`} onClick={() => setIsMobileMenuOpen(false)}>
              <History className="h-5 w-5 mr-3" /> History
            </Link>
            <Link to="/app/pricing" className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/app/pricing')}`} onClick={() => setIsMobileMenuOpen(false)}>
              <CreditCard className="h-5 w-5 mr-3" /> Plans
            </Link>
            <Link to="/app/settings" className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/app/settings')}`} onClick={() => setIsMobileMenuOpen(false)}>
              <Settings className="h-5 w-5 mr-3" /> Settings
            </Link>
          </div>

          <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
              <ThemeToggle />
            </div>

            {/* User Profile Snippet */}
            <div className="flex items-center mb-4 px-1">
              <div className="flex-shrink-0 mr-3 relative">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-600" />
                ) : (
                  <div className="bg-brand-100 dark:bg-brand-900/50 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button onClick={handleLogout} className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
              <LogOut className="h-5 w-5 mr-3" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sticky top-0 z-30">
          <div onClick={handleLogoClick} className="flex items-center cursor-pointer">
            <Sparkles className="h-6 w-6 text-brand-600 mr-2" />
            <span className="font-bold text-lg dark:text-white">SimpleWriteGO</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 dark:text-slate-300"><Menu /></button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    Sun,
    Moon,
    Home
} from 'lucide-react';
import { User } from '../../types';

interface AdminLayoutProps {
    user: User | null;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    onLogout: () => Promise<void>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, theme, toggleTheme, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await onLogout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path
        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                            <Shield className="h-6 w-6" />
                            <span className="font-bold text-lg text-slate-900 dark:text-white">Admin Panel</span>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500"><X size={20} /></button>
                    </div>

                    {/* Nav Links */}
                    <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Overview</div>

                        <Link to="/admin/dashboard" className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/admin/dashboard')}`} onClick={() => setIsMobileMenuOpen(false)}>
                            <LayoutDashboard className="h-5 w-5 mr-3" />
                            Dashboard
                        </Link>

                        <Link to="/admin/users" className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/admin/users')}`} onClick={() => setIsMobileMenuOpen(false)}>
                            <Users className="h-5 w-5 mr-3" />
                            User Management
                        </Link>

                        <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">System</div>

                        <Link to="/" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200" onClick={() => setIsMobileMenuOpen(false)}>
                            <Home className="h-5 w-5 mr-3" />
                            Back to App
                        </Link>
                    </div>

                    {/* Footer User & Logout */}
                    <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                            >
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            </button>
                        </div>

                        <div className="flex items-center mb-4 px-1">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold mr-3">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Administrator</p>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                            <LogOut className="h-5 w-5 mr-3" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sticky top-0 z-30">
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                        <Shield className="h-6 w-6 mr-2" />
                        <span className="font-bold text-lg text-slate-900 dark:text-white">Admin</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 dark:text-slate-300"><Menu /></button>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

import React, { useState, useEffect } from 'react';
import { Users, CreditCard, AlertCircle, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const [statsRes, activityRes] = await Promise.all([
                    fetch(`${API_URL}/api/admin/stats`),
                    fetch(`${API_URL}/api/admin/activity`)
                ]);

                const statsData = await statsRes.json();
                const activityData = await activityRes.json();

                // Map backend data to UI format
                const formattedStats = [
                    { label: 'Total Users', value: statsData.users, change: '+12%', trend: 'up', icon: Users, color: 'blue' },
                    { label: 'Active Subscriptions', value: statsData.subscriptions, change: '+5%', trend: 'up', icon: CreditCard, color: 'purple' },
                    { label: 'Total Revenue', value: statsData.revenue, change: '+23%', trend: 'up', icon: TrendingUp, color: 'green' },
                    { label: 'Pending Issues', value: statsData.issues, change: '-2', trend: 'down', icon: AlertCircle, color: 'amber' },
                ];

                setStats(formattedStats);
                setRecentActivity(activityData);
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full mr-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up'
                                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area Placeholder */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Revenue Analytics</h3>
                        <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 py-1 outline-none focus:ring-2 focus:ring-brand-500">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Last Quarter</option>
                        </select>
                    </div>

                    {/* Visual Placeholder for a Chart */}
                    <div className="h-64 w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-700">
                        <Activity className="h-10 w-10 mb-2 opacity-50" />
                        <p className="text-sm">Chart visualization would go here.</p>
                        <p className="text-xs opacity-75">(e.g. using Recharts or Chart.js)</p>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recent Activity</h3>
                        <Link to="/admin/users" className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline">View All</Link>
                    </div>

                    <div className="space-y-6">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3">
                                <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${activity.status === 'success' ? 'bg-green-500' :
                                    activity.status === 'error' ? 'bg-red-500' :
                                        activity.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`} />
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.action}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">by <span className="font-semibold text-slate-700 dark:text-slate-300">{activity.user}</span></p>
                                    <p className="text-[10px] text-slate-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

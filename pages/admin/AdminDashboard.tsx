import React, { useEffect, useState } from 'react';
import { getAllUsers, getAllInvoices, getSystemLogs } from '../../services/storageService';
import { User, PlanType } from '../../types';
import { Users, Activity, CreditCard, TrendingUp, AlertTriangle, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    revenue: 0,
    issues: 0
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    const users = getAllUsers();
    const invoices = getAllInvoices();
    const logs = getSystemLogs();

    const totalUsers = users.length;
    const subscriptions = users.filter(u => u.plan !== PlanType.FREE && u.status === 'active').length;
    const revenue = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const issues = logs.filter(l => l.severity === 'error' || l.severity === 'warning').length;

    setStats({
      totalUsers,
      activeSubscriptions: subscriptions,
      revenue,
      issues
    });
    setRecentLogs(logs.slice(0, 5));
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2 text-xs font-medium text-green-600 dark:text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              {trend} this month
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Platform overview and performance metrics.</p>
        </div>
        <div className="flex space-x-2">
           <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full flex items-center">
             <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
             System Operational
           </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" trend="+12%" />
        <StatCard title="Pro Subscribers" value={stats.activeSubscriptions} icon={CreditCard} color="bg-green-500" trend="+5%" />
        <StatCard title="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} icon={TrendingUp} color="bg-purple-500" trend="+8%" />
        <StatCard title="System Alerts" value={stats.issues} icon={AlertTriangle} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Usage (Words Generated)</h3>
            <select className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-transparent text-slate-600 dark:text-slate-300 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Year</option>
            </select>
          </div>
          
          <div className="relative h-64 w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg overflow-hidden flex items-end px-4 pt-10 pb-0">
             {/* Simulated SVG Area Chart */}
             <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                   <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                   <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                 </linearGradient>
               </defs>
               
               {/* Grid Lines */}
               <path d="M0,30 L100,30" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.1" />
               <path d="M0,20 L100,20" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.1" />
               <path d="M0,10 L100,10" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.1" />

               {/* Area */}
               <path d="M0,40 L0,32 Q10,25 20,28 T40,20 T60,15 T80,22 L100,10 L100,40 Z" fill="url(#chartGradient)" />
               
               {/* Line */}
               <path d="M0,32 Q10,25 20,28 T40,20 T60,15 T80,22 L100,10" fill="none" stroke="#8b5cf6" strokeWidth="0.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
             </svg>
             
             {/* X-Axis Labels (Simulated) */}
             <div className="absolute bottom-2 left-0 w-full flex justify-between px-2 text-[10px] text-slate-400">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
             </div>
          </div>
        </div>
        
        {/* Recent Logs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <Link to="/admin/system" className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 uppercase tracking-wide">View All</Link>
           </div>
           <div className="flex-1 overflow-y-auto space-y-4 pr-1">
             {recentLogs.length > 0 ? (
               recentLogs.map((log) => (
                 <div key={log.id} className="flex items-start group">
                    <div className="flex-shrink-0 mt-1">
                       <div className={`w-2 h-2 rounded-full ${log.severity === 'error' ? 'bg-red-500 shadow-red-500/50 shadow-sm' : log.severity === 'warning' ? 'bg-orange-500 shadow-orange-500/50 shadow-sm' : 'bg-green-500 shadow-green-500/50 shadow-sm'}`}></div>
                    </div>
                    <div className="ml-3 flex-1 border-b border-slate-100 dark:border-slate-800 pb-3 group-last:border-0 group-last:pb-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{log.action}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{log.details}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(log.date).toLocaleTimeString()} • {new Date(log.date).toLocaleDateString()}</p>
                    </div>
                 </div>
               ))
             ) : (
                <p className="text-sm text-slate-500 italic">No recent logs found.</p>
             )}
           </div>
           
           <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Link to="/admin/users" className="block w-full py-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-center rounded-lg text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-600 transition">
                 Manage Users
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
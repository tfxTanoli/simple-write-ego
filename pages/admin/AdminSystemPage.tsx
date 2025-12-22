import React, { useEffect, useState } from 'react';
import { getSystemLogs, getSystemConfig, saveSystemConfig } from '../../services/storageService';
import { SystemLog, SystemConfig } from '../../types';
import { Save, Server, Shield, Bell, Activity } from 'lucide-react';

const AdminSystemPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'settings' | 'security'>('settings');
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    setLogs(getSystemLogs());
    setConfig(getSystemConfig());
  }, []);

  const handleConfigChange = (key: keyof SystemConfig, value: any) => {
    if (!config) return;
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
  };

  const handleSaveConfig = () => {
    if (config) {
      saveSystemConfig(config);
      alert('System configuration saved.');
    }
  };

  if (!config) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System & Settings</h1>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {['settings', 'logs', 'security'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition ${
              activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 min-h-[400px]">
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white">General Configuration</h3>
                 <p className="text-slate-500 text-sm">Manage global system flags.</p>
               </div>
               <button onClick={handleSaveConfig} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center hover:bg-brand-700">
                 <Save className="h-4 w-4 mr-2" /> Save Changes
               </button>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-lg">
                   <div className="flex items-center">
                      <Server className="h-5 w-5 text-slate-400 mr-3" />
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">Maintenance Mode</p>
                        <p className="text-xs text-slate-500">Disable access for non-admin users.</p>
                      </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={config.maintenanceMode} onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                   </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-lg">
                   <div className="flex items-center">
                      <Activity className="h-5 w-5 text-slate-400 mr-3" />
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">Allow New Signups</p>
                        <p className="text-xs text-slate-500">Toggle public registration.</p>
                      </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={config.allowSignups} onChange={(e) => handleConfigChange('allowSignups', e.target.checked)} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                   </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-lg">
                   <div className="flex items-center">
                      <Bell className="h-5 w-5 text-slate-400 mr-3" />
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">Welcome Emails</p>
                        <p className="text-xs text-slate-500">Send automatic emails to new users.</p>
                      </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={config.emailSettings.welcomeEmail} onChange={(e) => handleConfigChange('emailSettings', { ...config.emailSettings, welcomeEmail: e.target.checked })} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                   </label>
                </div>
             </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="animate-in fade-in">
             <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">System Audit Logs</h3>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-700">
                    <tr>
                       <th className="p-3">Time</th>
                       <th className="p-3">Action</th>
                       <th className="p-3">Admin</th>
                       <th className="p-3">Details</th>
                    </tr>
                 </thead>
                 <tbody>
                    {logs.map(log => (
                       <tr key={log.id} className="border-b border-slate-50 dark:border-slate-800">
                          <td className="p-3 text-slate-500">{new Date(log.date).toLocaleString()}</td>
                          <td className="p-3 font-medium">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${log.severity === 'error' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                            {log.action}
                          </td>
                          <td className="p-3">{log.adminId}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{log.details}</td>
                       </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="animate-in fade-in max-w-2xl">
             <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Security Overview</h3>
             <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
               <Shield className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
               <div>
                  <h4 className="font-bold text-green-800">System Healthy</h4>
                  <p className="text-green-700 text-sm">No security vulnerabilities detected. All systems operational.</p>
               </div>
             </div>
             <p className="text-slate-500 italic">Advanced security logs and permission management would go here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSystemPage;
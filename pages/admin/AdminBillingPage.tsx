import React, { useEffect, useState } from 'react';
import { getAllInvoices, updateInvoiceStatus } from '../../services/storageService';
import { Invoice } from '../../types';
import { RefreshCw, Download, DollarSign } from 'lucide-react';

const AdminBillingPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setInvoices(getAllInvoices());
  }, []);

  const handleRefund = (id: string) => {
    if (confirm("Are you sure you want to refund this transaction?")) {
      updateInvoiceStatus(id, 'refunded');
      setInvoices(getAllInvoices());
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing & Refunds</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4 font-medium text-slate-500 text-sm">Invoice ID</th>
              <th className="p-4 font-medium text-slate-500 text-sm">User</th>
              <th className="p-4 font-medium text-slate-500 text-sm">Amount</th>
              <th className="p-4 font-medium text-slate-500 text-sm">Date</th>
              <th className="p-4 font-medium text-slate-500 text-sm">Status</th>
              <th className="p-4 font-medium text-slate-500 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">{inv.id}</td>
                <td className="p-4">
                   <div className="text-sm font-bold text-slate-900 dark:text-white">{inv.userName}</div>
                   <div className="text-xs text-slate-500">{inv.plan}</div>
                </td>
                <td className="p-4 font-bold text-slate-900 dark:text-white">${inv.amount}</td>
                <td className="p-4 text-sm text-slate-500">{inv.date}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    inv.status === 'paid' ? 'bg-green-100 text-green-700' : 
                    inv.status === 'refunded' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-slate-400 hover:text-slate-600"><Download className="h-4 w-4" /></button>
                  {inv.status === 'paid' && (
                    <button onClick={() => handleRefund(inv.id)} className="text-slate-400 hover:text-red-500" title="Refund">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBillingPage;
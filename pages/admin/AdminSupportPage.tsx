import React, { useEffect, useState } from 'react';
import { getAllTickets } from '../../services/storageService';
import { Ticket } from '../../types';
import { MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

const AdminSupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    setTickets(getAllTickets());
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tickets Section */}
        <div>
           <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
             <MessageSquare className="h-5 w-5 mr-2" /> Recent Tickets
           </h2>
           <div className="space-y-4">
             {tickets.map(ticket => (
               <div key={ticket.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <h3 className="font-bold text-slate-900 dark:text-white">{ticket.subject}</h3>
                     <p className="text-xs text-slate-500">by {ticket.userName}</p>
                   </div>
                   <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                     ticket.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                   }`}>
                     {ticket.priority}
                   </span>
                 </div>
                 <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">"{ticket.lastMessage}"</p>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">{ticket.date}</span>
                    <button className="text-brand-600 font-bold hover:underline">Reply</button>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Feedback Section (Mock) */}
        <div>
           <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
             <CheckCircle className="h-5 w-5 mr-2" /> User Feedback
           </h2>
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500">
              <p>No new feedback available.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;
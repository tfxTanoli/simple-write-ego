import React, { useState, useEffect } from 'react';
import { Clock, Search, Trash2, Copy, Check, FileText, Calendar } from 'lucide-react';
import { HistoryItem } from '../types';
import { getHistory, clearHistory } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';

const HistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setHistory(getHistory(currentUser.id));
    }
  }, [currentUser]);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your history? This cannot be undone.')) {
      if (currentUser) {
        clearHistory(currentUser.id);
        setHistory([]);
      }
    }
  };

  const filteredHistory = history.filter(item =>
    item.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.humanizedText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">History</h1>
          <p className="text-slate-500 dark:text-slate-400">View and retrieve your past transformations.</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search history..."
              className="pl-10 pr-4 py-2 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
          <div className="inline-flex h-16 w-16 bg-slate-100 dark:bg-slate-700 rounded-full items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-slate-300 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No history found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">Try humanizing some text or adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredHistory.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 hover:shadow-md transition duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${item.tone === 'Standard'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    : 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                    }`}>
                    {item.tone}
                  </span>
                  <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button onClick={() => navigator.clipboard.writeText(item.humanizedText)} className="text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition" title="Copy Result">
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase">Original</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    {item.originalText}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-2 uppercase">Humanized</h4>
                  <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-3 bg-brand-50/50 dark:bg-brand-900/10 p-3 rounded-lg border border-brand-100/50 dark:border-brand-900/20">
                    {item.humanizedText}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
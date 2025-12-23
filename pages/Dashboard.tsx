import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  History,
  ArrowUpRight,
  FileText,
  Activity,
  Zap,
  PlusCircle,
  Database,
  Minus,
  Plus,
  X
} from 'lucide-react';
import { User, HistoryItem, PlanType } from '../types';
import { getHistory } from '../services/storageService';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const history = getHistory(user.id).slice(0, 3); // Get last 3 items
  const usagePercent = Math.min(100, Math.round((user.wordsUsedToday / user.wordLimit) * 100));

  // Top-up Modal State
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpWords, setTopUpWords] = useState(5000);

  const MIN_WORDS = 1000;
  const MAX_WORDS = 30000;
  const STEP = 1000;
  // Price per 1000 words
  const PRICE_PER_1K = 1.00;

  // Determine label based on plan
  const limitLabel = user.plan === PlanType.FREE ? 'Daily Limit' : 'Monthly Limit';
  const resetLabel = user.plan === PlanType.FREE ? 'Resets in 12 hours' : 'Resets on next billing date';

  const increaseWords = () => {
    if (topUpWords < MAX_WORDS) {
      setTopUpWords(prev => prev + STEP);
    }
  };

  const decreaseWords = () => {
    if (topUpWords > MIN_WORDS) {
      setTopUpWords(prev => prev - STEP);
    }
  };

  const handleBuyCredits = () => {
    const price = (topUpWords / 1000) * PRICE_PER_1K;
    const targetUrl = `/checkout?type=credit&amount=${topUpWords}&price=${price}`;
    navigate(targetUrl);
    setShowTopUpModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-brand-100 mb-6 max-w-2xl">
          You've humanized {user.wordsUsedToday} words today. Keep up the great work creating authentic content.
        </p>
        <div className="flex space-x-4">
          <Link to="/app/humanizer" className="bg-white text-brand-600 px-6 py-2.5 rounded-full font-bold text-sm shadow hover:bg-brand-50 transition flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Start Humanizing
          </Link>
          {user.plan === PlanType.FREE && (
            <Link to="/app/pricing" className="bg-brand-800/50 backdrop-blur text-white border border-brand-400/30 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-800 transition flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Usage Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300 relative overflow-hidden group hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{limitLabel}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user.wordsUsedToday.toLocaleString()} <span className="text-sm font-normal text-slate-400 dark:text-slate-500">/ {user.wordLimit.toLocaleString()}</span>
              </h3>
            </div>
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-6">
            <div
              className={`h-2.5 rounded-full transition-all duration-1000 ${usagePercent > 90 ? 'bg-red-500' : 'bg-brand-500'}`}
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">{resetLabel}</p>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg hover:shadow-brand-500/25 active:scale-[0.98] transition-all flex items-center justify-center text-sm"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Get more words
            </button>
          </div>
        </div>

        {/* Plan Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Plan</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{user.plan}</h3>
            </div>
            <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
            {user.plan === PlanType.FREE ? 'Upgrade for unlimited words and faster processing.' : 'You have access to all premium features.'}
          </p>
          {user.plan === PlanType.FREE ? (
            <Link to="/app/pricing" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center">
              Upgrade now <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          ) : (
            <Link to="/app/pricing" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center">
              Manage Plan <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          )}
        </div>

        {/* Quick Tutorial */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-800/80 transition-colors duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pro Tip</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Better Results?</h3>
            </div>
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            Try using the "Conversational" tone for blog posts to increase reader engagement.
          </p>
        </div>
      </div>

      {/* Recent History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Rewrites</h2>
          <Link to="/app/history" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">View all</Link>
        </div>

        {history.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
            {history.map((item) => (
              <div key={item.id} className="p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer" onClick={() => navigate('/app/history')}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 uppercase">{item.tone}</span>
                    <span className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 dark:text-slate-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-1 font-medium">{item.humanizedText}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 text-center transition-colors duration-300">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 mb-3">
              <History className="h-6 w-6" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-medium mb-1">No history yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Your processed texts will appear here.</p>
            <Link to="/app/humanizer" className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline">Start writing</Link>
          </div>
        )}
      </div>

      {/* Pay As You Go Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mr-3">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pay As You Go</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Top up your balance instantly</p>
                </div>
              </div>
              <button onClick={() => setShowTopUpModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-700 mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Select Word Amount</p>

                <div className="flex items-center justify-between gap-4 mb-4">
                  <button
                    onClick={decreaseWords}
                    disabled={topUpWords <= MIN_WORDS}
                    className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Minus className="h-5 w-5" />
                  </button>

                  <div className="text-center">
                    <span className="block text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                      {topUpWords.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">words</span>
                  </div>

                  <button
                    onClick={increaseWords}
                    disabled={topUpWords >= MAX_WORDS}
                    className="h-10 w-10 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none transition transform active:scale-95"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-medium">
                  <span>Min: {MIN_WORDS.toLocaleString()}</span>
                  <span>Max: {MAX_WORDS.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Price</span>
                  <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    ${((topUpWords / 1000) * PRICE_PER_1K).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleBuyCredits}
                  className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition shadow-lg flex items-center justify-center"
                >
                  Buy Credits Now
                </button>
                <p className="text-xs text-center text-slate-400 mt-2">Credits never expire. One-time payment.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { Check, X, Star, Crown, ShieldCheck } from 'lucide-react';
import { PlanType } from '../types';
import { useNavigate } from 'react-router-dom';

interface PricingPageProps {
  user?: any;
  onPlanUpdate?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ user, onPlanUpdate }) => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleUpgrade = (plan: PlanType) => {
    const targetUrl = `/checkout?plan=${plan}&billing=${billingCycle}`;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
      return;
    }
    navigate(targetUrl);
  };

  // Helper to calculate discounted annual price
  const calculateAnnual = (monthlyPrice: number) => {
    return (monthlyPrice * 0.8).toFixed(2);
  };

  const plans = [
    {
      name: 'Pro',
      price: { monthly: '$7.99', annual: `$${calculateAnnual(7.99)}` },
      period: '/month',
      description: 'For students who need basic humanization features.',
      features: [
        '15,000 words per month',
        'Advanced AI Humanizer',
        'Unlimited AI Detection',
        'Multilingual support',
        '1,500 words per request',
        'My Writing Style',
        'Bypass Turnitin, GPTZero, Quillbot, ZeroGPT, Originality, Copyleaks'
      ],
      notIncluded: [
        'Fast processing',
        'Priority support'
      ],
      type: PlanType.PRO,
      buttonText: 'Subscribe',
      recommended: false,
      savings: null,
      icon: Star
    },
    {
      name: 'Ultra',
      price: { monthly: '$39.99', annual: `$${calculateAnnual(39.99)}` },
      period: '/month',
      description: 'For experts creating long-form articles and papers.',
      features: [
        '30,000 words per month',
        'Advanced AI Humanizer',
        'Unlimited AI Detection',
        'Multilingual support',
        '3,000 words per request',
        'My Writing Style',
        'Bypass Turnitin, GPTZero, Quillbot, ZeroGPT, Originality, Copyleaks',
        'Fast processing',
        'Priority support'
      ],
      notIncluded: [],
      type: PlanType.ULTRA,
      buttonText: 'Subscribe',
      recommended: true,
      savings: 'Save 20%',
      icon: Crown
    },
    {
      name: 'Unlimited',
      price: { monthly: '$79.99', annual: `$${calculateAnnual(79.99)}` },
      period: '/month',
      description: 'For premium users, unlimited access and full power.',
      features: [
        'Unlimited words per month',
        'Advanced AI Humanizer',
        'Unlimited AI Detection',
        'Multilingual support',
        '3,000 words per request',
        'My Writing Style',
        'Bypass Turnitin, GPTZero, Quillbot, ZeroGPT, Originality, Copyleaks',
        'Fast processing',
        'Priority support'
      ],
      notIncluded: [],
      type: PlanType.UNLIMITED,
      buttonText: 'Subscribe',
      recommended: false,
      savings: 'Save 20%',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">Choose the plan that fits your content needs. Cancel anytime.</p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span 
            className={`text-sm font-medium transition-colors duration-300 cursor-pointer ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </span>
          <button 
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${billingCycle === 'annual' ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}
          >
            <span className="sr-only">Toggle billing cycle</span>
            <span 
              className={`${
                billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
              } inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-300 cubic-bezier(0.4, 0, 0.2, 1)`}
            />
          </button>
          <span 
            className={`text-sm font-medium transition-colors duration-300 cursor-pointer flex items-center ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}`}
            onClick={() => setBillingCycle('annual')}
          >
            Annual 
            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:text-green-400 animate-pulse">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`
              group relative bg-white dark:bg-slate-800 rounded-3xl p-8 flex flex-col 
              transform transition-all duration-300 ease-out
              hover:-translate-y-2 hover:shadow-2xl 
              hover:border-brand-400
              ${plan.recommended 
                ? 'border-2 border-brand-500 ring-4 ring-brand-500/10 hover:shadow-brand-500/40' 
                : 'border border-slate-100 dark:border-slate-700 hover:shadow-brand-500/20 dark:hover:shadow-brand-900/40'
              }
            `}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 z-10">
                <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">Most Popular</span>
              </div>
            )}
            
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  <plan.icon className={`h-6 w-6 ${plan.recommended ? 'text-brand-500' : 'text-slate-400 group-hover:text-brand-500'}`} />
                  {plan.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-snug min-h-[40px]">{plan.description}</p>
              </div>
            </div>
            
            <div className="mb-2 overflow-hidden h-14 flex items-end">
              <span 
                key={billingCycle} // Key triggers animation on change
                className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-in slide-in-from-bottom-2 fade-in duration-300"
              >
                {billingCycle === 'monthly' ? plan.price.monthly : plan.price.annual}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-lg mb-1 ml-1">{plan.period}</span>
            </div>

            <div className="h-6 mb-8">
               {billingCycle === 'annual' ? (
                 <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded animate-in fade-in duration-500">
                   Billed annually
                 </span>
               ) : (
                 <span className="text-xs text-slate-400 dark:text-slate-500 block animate-in fade-in duration-500">Billed monthly</span>
               )}
            </div>

            <button
              onClick={() => handleUpgrade(plan.type)}
              disabled={user?.plan === plan.type}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 shadow-lg mb-8 ${
                plan.recommended
                  ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand-500/50 hover:scale-[1.02]'
                  : user?.plan === plan.type 
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-default shadow-none'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-brand-300 hover:text-brand-700 dark:hover:text-brand-300'
              }`}
            >
              {user?.plan === plan.type ? 'Current Plan' : plan.buttonText}
            </button>

            <div className="space-y-4 flex-1">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{feature}</span>
                </div>
              ))}
              {plan.notIncluded.map((feature, i) => (
                <div key={i} className="flex items-start opacity-50">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3 mt-0.5">
                    <X className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-500">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CreditCard, Lock, ShieldCheck, CheckCircle, ArrowLeft, Loader2, Sparkles, Database } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanType, User } from '../types';
import { updateUserPlan, addOneTimeCredits } from '../services/storageService';

interface CheckoutPageProps {
  user: User | null;
  onPlanUpdate: () => void;
}

const PLANS = {
  [PlanType.PRO]: { name: 'Pro', monthly: 7.99 },
  [PlanType.ULTRA]: { name: 'Ultra', monthly: 39.99 },
  [PlanType.UNLIMITED]: { name: 'Unlimited', monthly: 79.99 },
  [PlanType.FREE]: { name: 'Free', monthly: 0 }
};

const CheckoutPage: React.FC<CheckoutPageProps> = ({ user, onPlanUpdate }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Distinguish between Plan Subscription and Credit Top-up
  const checkoutType = searchParams.get('type') === 'credit' ? 'credit' : 'plan';

  // Plan Params
  const planParam = searchParams.get('plan') as PlanType;
  const billingCycle = searchParams.get('billing') === 'annual' ? 'annual' : 'monthly';
  
  // Credit Params
  const creditAmount = parseInt(searchParams.get('amount') || '0');
  const creditPrice = parseFloat(searchParams.get('price') || '0');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Determination Logic
  const selectedPlan = PLANS[planParam] || PLANS[PlanType.PRO];
  
  let itemName = '';
  let itemDescription = '';
  let total = 0;
  let saveBadge = null;

  if (checkoutType === 'credit') {
    itemName = `${creditAmount.toLocaleString()} Words`;
    itemDescription = 'One-time credit top-up';
    total = creditPrice;
  } else {
    itemName = `${selectedPlan.name} Plan`;
    itemDescription = `${billingCycle} subscription`;
    const basePrice = selectedPlan.monthly;
    const price = billingCycle === 'annual' ? (basePrice * 0.8) : basePrice;
    total = price;
    if (billingCycle === 'annual') {
       saveBadge = <span className="text-xs text-green-400">Saved 20%</span>;
    }
  }

  useEffect(() => {
    if (checkoutType === 'plan' && (!planParam || !Object.values(PlanType).includes(planParam))) {
      navigate('/pricing');
    }
    if (checkoutType === 'credit' && (creditAmount <= 0 || creditPrice <= 0)) {
        navigate('/pricing');
    }
  }, [checkoutType, planParam, creditAmount, creditPrice, navigate]);

  // Use Effect to ensure confetti fires when success state is active
  useEffect(() => {
    if (isSuccess) {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#7c3aed', '#8b5cf6', '#a78bfa'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [isSuccess]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Stripe/Payment Gateway delay
    setTimeout(() => {
      if (checkoutType === 'credit') {
         addOneTimeCredits(creditAmount);
      } else {
         updateUserPlan(planParam);
      }
      
      onPlanUpdate();
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Redirect to dashboard after showing success message
      setTimeout(() => {
        navigate('/app');
      }, 4000);
    }, 2000);
  };

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(val.replace(/(\d{4})(?=\d)/g, '$1 '));
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 text-center max-w-md w-full animate-in zoom-in duration-500 relative overflow-hidden">
           <div className="absolute inset-0 bg-brand-50 dark:bg-brand-900/10 opacity-50"></div>
           <div className="relative z-10">
             <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-green-50 dark:ring-green-900/10">
               <CheckCircle className="h-12 w-12" />
             </div>
             <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Congratulations!</h2>
             <div className="flex justify-center mb-6">
               <span className="px-5 py-1.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm flex items-center shadow-lg">
                 {checkoutType === 'credit' ? <Database className="h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                 {checkoutType === 'credit' ? 'Credits Added' : `${selectedPlan.name} Plan Unlocked`}
               </span>
             </div>
             <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
               {checkoutType === 'credit' 
                 ? `You have successfully added ${creditAmount.toLocaleString()} words to your balance.`
                 : `You are now subscribed to the ${selectedPlan.name} plan. Get ready to create amazing human-like content!`
               }
             </p>
             <div className="flex justify-center items-center space-x-2 bg-slate-50 dark:bg-slate-700/50 py-3 rounded-xl">
               <Loader2 className="h-5 w-5 text-brand-600 dark:text-brand-400 animate-spin" />
               <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Redirecting to dashboard...</p>
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
           <Link to="/pricing" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center text-sm font-medium transition">
             <ArrowLeft className="h-4 w-4 mr-1" /> Back to Pricing
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Payment Form */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                   <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                     <Lock className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" /> Secure Checkout
                   </h2>
                   <div className="flex space-x-2">
                      <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded opacity-50"></div>
                      <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded opacity-50"></div>
                      <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded opacity-50"></div>
                   </div>
                </div>
                
                <div className="p-8">
                   <form onSubmit={handlePayment} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name on Card</label>
                        <input 
                          type="text" 
                          required
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white transition"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                        <div className="relative">
                           <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                           <input 
                              type="text" 
                              required
                              placeholder="0000 0000 0000 0000"
                              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white transition font-mono"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                           />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                            <input 
                              type="text" 
                              required
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white transition text-center"
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              maxLength={5}
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CVC</label>
                            <input 
                              type="text" 
                              required
                              placeholder="123"
                              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white transition text-center"
                              value={cvc}
                              onChange={(e) => setCvc(e.target.value)}
                              maxLength={4}
                            />
                         </div>
                      </div>

                      <div className="pt-4">
                         <button 
                            type="submit" 
                            disabled={isProcessing}
                            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg hover:shadow-brand-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center justify-center text-lg"
                         >
                            {isProcessing ? (
                              <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Processing...</>
                            ) : (
                              `Pay $${total.toFixed(2)}`
                            )}
                         </button>
                         <div className="text-center mt-4 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                            <ShieldCheck className="h-3 w-3 mr-1" /> Payments are secure and encrypted
                         </div>
                      </div>
                   </form>
                </div>
             </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
             <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                   <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                      <div>
                         <p className="font-bold text-lg">{itemName}</p>
                         <p className="text-sm text-slate-400 capitalize">{itemDescription}</p>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-lg">${total.toFixed(2)}</p>
                         {saveBadge}
                      </div>
                   </div>
                   
                   <div className="flex justify-between items-center text-slate-400 text-sm">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center text-slate-400 text-sm">
                      <span>Tax (0%)</span>
                      <span>$0.00</span>
                   </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                   <span className="text-lg font-bold">Total Due</span>
                   <span className="text-2xl font-bold text-brand-400">${total.toFixed(2)}</span>
                </div>
             </div>
             
             <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-sm text-blue-800 dark:text-blue-300">
                <p className="flex items-start">
                   <ShieldCheck className="h-5 w-5 mr-2 flex-shrink-0" />
                   <span>
                      <strong>Money-Back Guarantee:</strong> If you're not satisfied with SimpleWriteGo within the first 7 days, we'll refund your payment.
                   </span>
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
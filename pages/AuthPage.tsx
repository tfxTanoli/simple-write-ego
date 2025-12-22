import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2, Github } from 'lucide-react';
import { User } from '../types';
import { loginUser, signupUser } from '../services/storageService';

interface AuthPageProps {
  setUser: (user: User) => void;
  mode?: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ setUser, mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  // Handle post-login redirection
  const handleSuccess = (user: User) => {
    setUser(user);
    setIsLoading(false);
    setIsGoogleLoading(false);
    
    // Check for redirect parameter
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      navigate(redirectUrl);
    } else {
      navigate('/app');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      let user;
      if (isLogin) {
        user = loginUser(email);
      } else {
        user = signupUser(email, name || 'User');
      }
      handleSuccess(user);
    }, 1500);
  };

  const handleGoogleAuth = () => {
    setIsGoogleLoading(true);
    // Simulate Google OAuth Popup and Redirect
    setTimeout(() => {
      // Mock successful Google Login with sample data
      const user = signupUser('alex.google@gmail.com', 'Alex from Google');
      handleSuccess(user);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <div className="text-center">
          <Link to="/" className="mx-auto h-12 w-12 bg-brand-100 dark:bg-brand-900/40 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 inline-flex">
            <Sparkles className="h-6 w-6" />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {isLogin 
              ? 'Sign in to continue humanizing your text' 
              : 'Start making your AI content undetectable'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  className="mt-1 block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
                Remember me
              </label>
            </div>
            {isLogin && (
              <div className="text-sm">
                <a href="#" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">
                  Forgot password?
                </a>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              isLogin ? 'Sign in' : 'Create account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-600 dark:text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link 
              to={isLogin ? `/signup?redirect=${searchParams.get('redirect') || ''}` : `/login?redirect=${searchParams.get('redirect') || ''}`}
              className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
             <button 
                type="button" 
                onClick={handleGoogleAuth}
                disabled={isLoading || isGoogleLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed transition items-center"
             >
                {isGoogleLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 text-brand-600" />
                ) : (
                  <>
                    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M12.0003 20.45c4.6667 0 8.45-3.7833 8.45-8.45 0-4.6667-3.7833-8.45-8.45-8.45-4.6667 0-8.45 3.7833-8.45 8.45 8.45 0 4.6667 3.7833 8.45 8.45 8.45z" fill="#fff" />
                      <path d="M20.55 12c0-.58-.05-1.15-.15-1.7H12v3.21h4.79c-.21 1.11-.84 2.05-1.8 2.68v2.23h2.92c1.71-1.57 2.69-3.89 2.64-6.42z" fill="#4285F4"/>
                      <path d="M12 20.65c2.4 0 4.42-.8 5.89-2.16l-2.92-2.23c-.8.54-1.82.86-2.97.86-2.31 0-4.27-1.56-4.97-3.66H4.09v2.27c1.46 2.9 4.45 4.92 7.91 4.92z" fill="#34A853"/>
                      <path d="M7.03 13.46c-.18-.54-.28-1.12-.28-1.71 0-.59.1-1.17.28-1.71V7.77H4.09c-.61 1.21-.95 2.58-.95 4.02 0 1.44.34 2.81.95 4.02l2.94-2.35z" fill="#FBBC05"/>
                      <path d="M12 6.55c1.3.01 2.55.47 3.47 1.34l2.6-2.59c-1.63-1.52-3.8-2.38-6.07-2.36-3.46 0-6.45 2.02-7.91 4.92l2.94 2.35c.7-2.1 2.66-3.66 4.97-3.66z" fill="#EA4335"/>
                    </svg>
                    <span className="ml-2">Google</span>
                  </>
                )}
             </button>
             <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition">
                <Github className="h-5 w-5 text-slate-900 dark:text-white" />
                <span className="ml-2">GitHub</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
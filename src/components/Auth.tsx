import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { AuthService } from '../services/supabase';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const result = await AuthService.signUp(email, password, fullName);
        if (result.user) {
          // For development, we'll consider signup successful even without email confirmation
          onAuthSuccess();
        }
      } else {
        const result = await AuthService.signIn(email, password);
        if (result.user) {
          onAuthSuccess();
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message?.includes('Unable to validate email address')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message?.includes('Network request failed') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@lifeos.app');
    setPassword('demo123');
    setIsLoading(true);
    setError(null);

    try {
      // Try to sign in with demo account, if it doesn't exist, create it
      try {
        await AuthService.signIn('demo@lifeos.app', 'demo123');
        onAuthSuccess();
      } catch (signInError: any) {
        if (signInError.message?.includes('Invalid login credentials')) {
          // Demo account doesn't exist, create it
          await AuthService.signUp('demo@lifeos.app', 'demo123', 'Demo User');
          onAuthSuccess();
        } else {
          throw signInError;
        }
      }
    } catch (error: any) {
      console.error('Demo login error:', error);
      setError('Failed to access demo account. Please try manual login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">LifeOS</h1>
          <p className="text-slate-600">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Demo Access */}
        <div className="mb-6">
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-medium hover:from-emerald-500 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? 'Accessing Demo...' : 'Try Demo Account'}
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">or</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glassmorphism-light border border-white/50 text-slate-900 placeholder-slate-500 focus:border-blue-400/50 focus:outline-none"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glassmorphism-light border border-white/50 text-slate-900 placeholder-slate-500 focus:border-blue-400/50 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl glassmorphism-light border border-white/50 text-slate-900 placeholder-slate-500 focus:border-blue-400/50 focus:outline-none"
                placeholder="Enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-medium hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </motion.button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-slate-600 hover:text-slate-800 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
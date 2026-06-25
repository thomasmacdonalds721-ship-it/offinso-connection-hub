import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Lock, Mail, User as UserIcon, ArrowRight, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register' | 'forgot-password'>('login');
  
  // Input fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  // UI state
  const [showPass, setShowPass] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSwitchView = (newView: typeof view) => {
    setView(newView);
    setErrorText('');
    setSuccessText('');
  };

  // Submit Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    setIsLoading(true);

    if (!email.trim() || !username.trim() || !fullName.trim() || !password.trim()) {
      setErrorText('Please fill in all blanks.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorText('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    // Mock register if Supabase is not configured
    if (!isSupabaseConfigured) {
      const registeredUser: User = {
        id: `mock_user_${Date.now()}`,
        username: username.trim().toLowerCase(),
        email: email.trim(),
        fullName: fullName.trim() + ' (Local)',
        phone: '',
        address: '',
        registeredAt: new Date().toISOString()
      };

      setSuccessText('Registration successful! (Local Offline Mode - Logging you in...)');
      setTimeout(() => {
        onLoginSuccess(registeredUser);
        onClose();
        setEmail('');
        setUsername('');
        setFullName('');
        setPassword('');
      }, 1500);
      setIsLoading(false);
      return;
    }

    try {
      // Check username is not already taken
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.trim().toLowerCase())
        .maybeSingle();

      if (existingProfile) {
        setErrorText('This username is already taken.');
        setIsLoading(false);
        return;
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            username: username.trim().toLowerCase(),
            full_name: fullName.trim()
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      const authUser = signUpData?.user;
      if (authUser) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            username: username.trim().toLowerCase(),
            full_name: fullName.trim(),
            phone: '',
            address: ''
          });

        if (profileError) {
          console.error("Profile insert failed:", profileError);
        }

        const registeredUser: User = {
          id: authUser.id,
          username: username.trim().toLowerCase(),
          email: email.trim(),
          fullName: fullName.trim(),
          registeredAt: new Date().toISOString()
        };

        setSuccessText('Registration successful! Logging you in...');
        setTimeout(() => {
          onLoginSuccess(registeredUser);
          onClose();
          setEmail('');
          setUsername('');
          setFullName('');
          setPassword('');
        }, 1500);
      } else {
        throw new Error('Could not create auth session.');
      }

    } catch (err: any) {
      setErrorText(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setErrorText('Please enter your email and password.');
      setIsLoading(false);
      return;
    }

    // Mock login if Supabase is not configured
    if (!isSupabaseConfigured) {
      const loggedUser: User = {
        id: 'mock_user_123',
        username: email.trim().split('@')[0],
        email: email.trim(),
        fullName: 'Kwame Offinso (Local Offline Mode)',
        phone: '+233 24 123 4567',
        address: 'Offinso Market Street, Ghana',
        registeredAt: new Date().toISOString()
      };

      setSuccessText('Log in successful! Welcome to the Gateway.');
      setTimeout(() => {
        onLoginSuccess(loggedUser);
        onClose();
        setEmail('');
        setPassword('');
      }, 1500);
      setIsLoading(false);
      return;
    }

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        throw signInError;
      }

      const authUser = signInData?.user;
      if (authUser) {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        const loggedUser: User = {
          id: authUser.id,
          username: profileData?.username || authUser.user_metadata?.username || authUser.email?.split('@')[0] || '',
          email: authUser.email || '',
          fullName: profileData?.full_name || authUser.user_metadata?.full_name || '',
          phone: profileData?.phone || authUser.user_metadata?.phone || '',
          address: profileData?.address || authUser.user_metadata?.address || '',
          registeredAt: profileData?.registered_at || new Date().toISOString()
        };

        setSuccessText('Log in successful! Welcome to the Gateway.');
        setTimeout(() => {
          onLoginSuccess(loggedUser);
          onClose();
          setEmail('');
          setPassword('');
        }, 1500);
      } else {
        throw new Error('Session details are unavailable.');
      }

    } catch (err: any) {
      setErrorText(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    setIsLoading(true);

    if (!forgotEmail.trim()) {
      setErrorText('Please specify your registered email.');
      setIsLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setSuccessText('A password reset link has been simulated & dispatched to your email coordinates.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: window.location.origin,
      });

      if (error) {
        throw error;
      }

      setSuccessText('A password reset link has been dispatched to your email coordinates.');
    } catch (err: any) {
      setErrorText(err.message || 'Failed to dispatch reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-zinc-200"
      >
        {/* Banner header */}
        <div className="bg-offinso-green-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <span className="text-[10px] font-mono font-bold tracking-widest text-offinso-gold uppercase mb-1 block">
            Offinso Connection Secure Hub
          </span>
          <h3 className="font-serif text-2xl font-bold">
            {view === 'login' && 'Gateway Cabin Sign In'}
            {view === 'register' && 'Register Community Account'}
            {view === 'forgot-password' && 'Recover Password'}
          </h3>
          <p className="text-white/80 text-xs mt-1">
            {view === 'login' && 'Verify credentials to authorize portal actions, submit job resumes, or place live lots bids.'}
            {view === 'register' && 'Join Offinso Connection civic web portal. Secure, local, and transparent.'}
            {view === 'forgot-password' && 'Confirm registered residency coordinates to launch credential verification.'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Message alerts */}
          {errorText && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorText}</span>
            </div>
          )}

          {successText && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-start gap-2 text-xs">
              <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successText}</span>
            </div>
          )}

          {/* Form blocks */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 block">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2 pl-9 pr-4 text-zinc-950 focus:outline-none focus:border-offinso-green-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-zinc-700">Password</label>
                  <button
                    type="button"
                    onClick={() => handleSwitchView('forgot-password')}
                    className="text-offinso-green-800 hover:underline hover:text-offinso-green-950 font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2 pl-9 pr-10 text-zinc-955 focus:outline-none focus:border-offinso-green-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-650 cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-offinso-green-800 hover:bg-offinso-green-900 border border-transparent font-bold py-2.5 rounded-lg text-white uppercase tracking-wider transition text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Sign In Now'} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 text-zinc-500 border-t">
                Don&apos;t have a community account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchView('register')}
                  className="text-offinso-green-800 font-bold hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 font-sans text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="kwame_ofso"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2 pl-9 pr-4 text-zinc-955 focus:outline-none focus:border-offinso-green-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Kwame Offinso"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2 px-3 text-zinc-955 focus:outline-none focus:border-offinso-green-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 block">Email Coordinate</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="kwame@offinsomutual.org.gh"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2 pl-9 pr-4 text-zinc-955 focus:outline-none focus:border-offinso-green-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 block">Password (min 6 chars)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2 pl-9 pr-10 text-zinc-955 focus:outline-none focus:border-offinso-green-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-650 cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-offinso-green-800 hover:bg-offinso-green-700 font-bold py-2.5 rounded-lg text-white uppercase tracking-wider transition text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Register Local Account'}
              </button>

              <div className="text-center pt-2 text-zinc-500 border-t">
                Already registered with us?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchView('login')}
                  className="text-offinso-green-800 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {view === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 block">Residency Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2 pl-9 pr-4 text-zinc-955 focus:outline-none focus:border-offinso-green-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider transition text-xs cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Dispatching...' : 'Dispatch Reset Link'}
              </button>

              <div className="text-center pt-2 text-zinc-500 border-t">
                Remembered?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchView('login')}
                  className="text-offinso-green-800 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

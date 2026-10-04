import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, Mail, Lock, User, ChevronRight, ShieldCheck, Globe, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password registration is currently disabled in Firebase. Please use Google Sign-In instead.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#070708]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[128px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl relative"
      >
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-xl mb-4 shadow-lg shadow-orange-600/20">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-500 text-sm">Start deploying high-performance servers today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="text" 
                  required
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Last Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="text" 
                  required
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex items-start gap-3 px-1 py-2">
              <input type="checkbox" required className="mt-1 accent-orange-600" />
              <p className="text-xs text-slate-500 leading-relaxed">
                I agree to the <a href="#" className="text-orange-500 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>.
              </p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="md:col-span-2 py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 group"
            >
              {loading ? "Creating account..." : "Complete Registration"}
              {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="md:col-span-2 mt-4 relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative px-4 bg-[#070708] text-[10px] text-slate-600 uppercase tracking-widest">Or signup with</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="md:col-span-2 flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all shadow-xl shadow-black/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-orange-500/50" />
              <span className="text-[10px] text-slate-600 uppercase font-bold">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Zap className="w-5 h-5 text-orange-500/50" />
              <span className="text-[10px] text-slate-600 uppercase font-bold">Instant</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Globe className="w-5 h-5 text-orange-500/50" />
              <span className="text-[10px] text-slate-600 uppercase font-bold">Global</span>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-orange-500 font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

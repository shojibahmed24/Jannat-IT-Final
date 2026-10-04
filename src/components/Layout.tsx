import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Zap, 
  Menu, 
  X, 
  Shield, 
  ChevronRight,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "VPS Hosting", path: "/vps" },
    { name: "RDP Servers", path: "/rdp" },
    { name: "Dedicated", path: "/dedicated" },
    { name: "Domains", path: "/domains" },
    { name: "About Us", path: "/about" },
  ];

  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-orange-500/30">
      {/* Promo Banner */}
      {!isDashboard && (
        <div className="bg-gradient-to-r from-[#FF4D00] to-[#FF6A00] py-2 px-4 text-center">
          <p className="text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2">
            <span role="img" aria-label="fire">🔥</span>
            Limited-time offer — <a href="#pricing" className="underline underline-offset-2 hover:text-white/90">save up to 55% on annual VPS plans</a>
          </p>
        </div>
      )}

      {/* Header */}
      {!isDashboard && (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-white/5 h-16' 
            : 'bg-[#0A0A0B] h-20'
        }`}>
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            {/* Zone 1: Brand */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#FF4D00] rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">jannatit.net</span>
            </Link>

            {/* Zone 2: Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400">
              <Link to="/rdp" className="hover:text-white transition-colors">Windows RDP</Link>
              <Link to="/vps" className="hover:text-white transition-colors">VPS Hosting</Link>
              <Link to="/about" className="hover:text-white transition-colors">Locations</Link>
              <Link to="/about" className="hover:text-white transition-colors">FAQ</Link>
              <Link to="/about" className="hover:text-white transition-colors">Affiliates</Link>
            </nav>

            {/* Zone 3: Actions */}
            <div className="flex items-center gap-4">
              {firebaseUser ? (
                <Link to="/dashboard" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#FF4D00]/50 transition-all">
                    <User className="w-5 h-5 text-slate-400 group-hover:text-[#FF4D00] transition-colors" />
                  </div>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="hidden sm:block text-sm font-bold border border-white/10 px-6 py-2.5 rounded-lg hover:bg-white/5 transition-all text-white"
                  >
                    Client Login
                  </Link>
                  <Link 
                    to="/vps" 
                    className="px-6 py-2.5 text-sm font-bold bg-[#FF4D00] hover:bg-[#FF6A00] text-white rounded-lg transition-all shadow-lg shadow-orange-600/20 whitespace-nowrap"
                  >
                    Order Now
                  </Link>
                </>
              )}
              <button 
                className="lg:hidden p-2 text-slate-400 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && !isDashboard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0A0A0B]/98 backdrop-blur-2xl lg:hidden flex flex-col"
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <div className="w-8 h-8 bg-[#FF4D00] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">jannatit.net</span>
              </Link>
              <button 
                className="p-2 text-white hover:bg-white/5 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-12 px-8">
              <div className="flex flex-col gap-8">
                {[
                  { name: "Windows RDP", path: "/rdp" },
                  { name: "VPS Hosting", path: "/vps" },
                  { name: "Locations", path: "/about" },
                  { name: "FAQ", path: "/about" },
                  { name: "Affiliates", path: "/about" },
                ].map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      to={link.path} 
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center justify-between py-2"
                    >
                      <span className="text-3xl font-black text-white tracking-tighter group-hover:text-[#FF4D00] transition-colors uppercase">
                        {link.name}
                      </span>
                      <ChevronRight className="w-6 h-6 text-[#FF4D00] opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 pt-12 border-t border-white/5 flex flex-col gap-6">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-4 border border-white/10 text-white font-bold rounded-xl text-center"
                >
                  Client Login
                </Link>
                <Link 
                  to="/vps" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-4 bg-[#FF4D00] text-white font-black rounded-xl text-center shadow-xl shadow-orange-600/20"
                >
                  Order Now
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {children}
      </main>

      {/* Footer */}
      {!isDashboard && (
        <footer className="py-20 border-t border-white/5 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                  <span className="text-xl font-bold tracking-tight text-white">Jannat <span className="text-orange-500">IT</span></span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Providing premium virtual private servers and RDP solutions since 2018. Built for speed, reliability, and security.
                </p>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="text-slate-400">𝕏</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="text-slate-400">f</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="text-slate-400">in</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Services</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><Link to="/vps" className="hover:text-orange-500 transition-colors">Windows VPS</Link></li>
                  <li><Link to="/vps" className="hover:text-orange-500 transition-colors">Linux Hosting</Link></li>
                  <li><Link to="/rdp" className="hover:text-orange-500 transition-colors">RDP Servers</Link></li>
                  <li><Link to="/dedicated" className="hover:text-orange-500 transition-colors">Dedicated Servers</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-orange-500 transition-colors">Knowledge Base</a></li>
                  <li><a href="#" className="hover:text-orange-500 transition-colors">Submit Ticket</a></li>
                  <li><a href="#" className="hover:text-orange-500 transition-colors">Network Status</a></li>
                  <li><Link to="/about" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Legal</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-orange-500 transition-colors">SLA Agreement</a></li>
                  <li><a href="#" className="hover:text-orange-500 transition-colors">Refund Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
              <p>© 2026 Jannat IT Solutions. All rights reserved.</p>
              <div className="flex gap-6">
                <span>Managed with Precision</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure Payment</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

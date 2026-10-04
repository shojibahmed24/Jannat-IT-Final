import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Globe, Shield, Zap, Check, AlertCircle, ShoppingCart, Loader2 } from 'lucide-react';

import { useApp } from '../context/AppContext';

export default function Domains() {
  const { settings } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ domain: string, available: boolean, price: string } | null>(null);

  const TLD_PRICES = [
    { tld: ".com", price: settings?.domainPrice || "9.99", sale: true },
    { tld: ".net", price: (Number(settings?.domainPrice || 9.99) + 2).toFixed(2) },
    { tld: ".org", price: (Number(settings?.domainPrice || 9.99) + 3).toFixed(2) },
    { tld: ".io", price: "34.99" },
    { tld: ".xyz", price: "1.99", sale: true },
    { tld: ".dev", price: "14.99" },
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setResults(null);

    // Add .com if no TLD is provided
    let domainToCheck = searchTerm;
    if (!domainToCheck.includes('.')) {
      domainToCheck += '.com';
    }

    try {
      const response = await fetch(`/api/domain/check?domain=${domainToCheck}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full hero-grid opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-500/20 text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-8">
            Global Domain Registration
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-white mb-6 tracking-tighter">Find Your Perfect Domain</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Secure your online identity with our fast and easy domain registration service.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-20">
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              placeholder="Search for your dream domain (e.g. firevps.com)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] py-6 px-10 text-xl text-white focus:outline-none focus:border-orange-500/50 transition-all shadow-2xl backdrop-blur-md"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-10 py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black rounded-3xl transition-all flex items-center gap-2 shadow-xl shadow-orange-600/40 uppercase tracking-widest text-xs"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
          
          <AnimatePresence>
            {results && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-10 p-8 rounded-[2rem] border flex flex-col md:flex-row items-center justify-between gap-8 ${
                  results.available 
                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                  : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    results.available ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {results.available ? <Check className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-black text-white uppercase tracking-tight">{results.domain}</div>
                    <div className={`text-base font-medium ${results.available ? 'text-emerald-500' : 'text-red-500'}`}>
                      {results.available ? 'Great news! This domain is available.' : 'Sorry, this domain is already registered.'}
                    </div>
                  </div>
                </div>

                {results.available && (
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="text-center md:text-right">
                      <div className="text-3xl font-black text-white">${results.price}</div>
                      <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Yearly Price</div>
                    </div>
                    <Link 
                      to="/dashboard" 
                      className="flex-1 md:flex-none px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Buy Now
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
            {TLD_PRICES.map(item => (
              <div key={item.tld} className="flex items-center gap-3 text-slate-500">
                <span className="font-bold text-white text-lg">{item.tld}</span>
                <span className="font-medium">${item.price}</span>
                {item.sale && <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full uppercase font-black tracking-widest">Sale</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <div className="p-10 rounded-[2.5rem] glass-card border-white/5 text-center group hover:border-orange-500/30 transition-all">
            <Shield className="w-12 h-12 text-orange-500 mx-auto mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">WHOIS Privacy</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Keep your personal contact information hidden from the public WHOIS database for free.</p>
          </div>
          <div className="p-10 rounded-[2.5rem] glass-card border-white/5 text-center group hover:border-orange-500/30 transition-all">
            <Zap className="w-12 h-12 text-orange-500 mx-auto mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Instant Activation</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Your domain is registered and ready to use immediately after checkout.</p>
          </div>
          <div className="p-10 rounded-[2.5rem] glass-card border-white/5 text-center group hover:border-orange-500/30 transition-all">
            <Globe className="w-12 h-12 text-orange-500 mx-auto mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">DNS Management</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Easy-to-use control panel to manage your A, MX, CNAME, and TXT records.</p>
          </div>
        </div>

        {/* Domain Pricing Table */}
        <div className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/5 glass-card">
          <div className="px-10 py-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white tracking-tight">Domain Extension Pricing</h2>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Updates</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-10 py-6">Extension</th>
                  <th className="px-10 py-6">Registration</th>
                  <th className="px-10 py-6">Renewal</th>
                  <th className="px-10 py-6">Transfer</th>
                  <th className="px-10 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {TLD_PRICES.map(item => (
                  <tr key={item.tld} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8 font-black text-white text-xl">{item.tld}</td>
                    <td className="px-10 py-8 font-bold">${item.price}</td>
                    <td className="px-10 py-8 font-bold">${item.price}</td>
                    <td className="px-10 py-8 font-bold">${item.price}</td>
                    <td className="px-10 py-8 text-right">
                      <Link to="/dashboard" className="px-6 py-2 bg-white/5 hover:bg-orange-600 hover:text-white text-slate-400 font-black rounded-xl transition-all inline-block uppercase tracking-widest text-[10px]">Register</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

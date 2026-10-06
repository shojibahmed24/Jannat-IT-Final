import { useSEO } from '../hooks/useSEO';
import React, { useState } from 'react';
import { Search, CheckCircle2, Shield, Zap, Globe, RefreshCcw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedSection from '../components/ui/AnimatedSection';
import MagneticButton from '../components/ui/MagneticButton';
import { useApp } from '../context/AppContext';

export default function Domains() {
  useSEO({ title: 'Domain Registration - Jannat IT' });
  const { settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<null | { available: boolean, domain: string, price: string, error?: string }>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    let query = searchQuery.trim().toLowerCase();
    if (!query) return;
    
    // Auto-append .com if no extension provided
    if (!query.includes('.')) {
      query = `${query}.com`;
      setSearchQuery(query);
    }

    setIsSearching(true);
    setSearchResult(null);
    
    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!domainRegex.test(query)) {
      setIsSearching(false);
      setSearchResult({ available: false, domain: query, price: '', error: 'Invalid domain format' });
      return;
    }

    try {
      // Using Google DoH (DNS over HTTPS) API as a clever free way to check availability
      // Status 3 (NXDOMAIN) means the domain has no DNS records (likely available)
      // Status 0 (NOERROR) means the domain exists (taken)
      const res = await fetch(`https://dns.google/resolve?name=${query}`);
      const data = await res.json();
      
      const isAvailable = data.Status === 3;
      
      // Determine price based on extension
      const extension = '.' + query.split('.').slice(1).join('.');
      const pricingObj = domainPricing.find((d: any) => d.tld === extension) || domainPricing[0];

      setSearchResult({
        available: isAvailable,
        domain: query,
        price: pricingObj.registration
      });
    } catch (err) {
      // Fallback if API fails
      setSearchResult({
        available: false,
        domain: query,
        price: '',
        error: 'Network error. Try again.'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const MOCK_DOMAINS = [
    { tld: '.com', registration: '$9.99', renewal: '$12.99', transfer: '$9.99', badge_color: 'blue' },
    { tld: '.net', registration: '$11.99', renewal: '$13.99', transfer: '$11.99', badge_color: 'orange' },
    { tld: '.org', registration: '$12.99', renewal: '$14.99', transfer: '$12.99', badge_color: 'green' },
    { tld: '.io', registration: '$34.99', renewal: '$39.99', transfer: '$34.99', badge_color: 'purple' },
    { tld: '.xyz', registration: '$1.99', renewal: '$12.99', transfer: '$1.99', badge_color: 'slate' },
    { tld: '.dev', registration: '$14.99', renewal: '$16.99', transfer: '$14.99', badge_color: 'slate' },
  ];

  const domainPricing = (settings?.domain_pricing && settings.domain_pricing.length > 0) 
    ? settings.domain_pricing 
    : MOCK_DOMAINS;

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'orange': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'blue': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'purple': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'green': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  return (
    <div className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative z-10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Search Hero Section */}
        <AnimatedSection className="text-center mb-10 lg:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Perfect Domain</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Register your digital identity today. Free WHOIS privacy, advanced DNS, and 24/7 support included with every domain.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className={`w-6 h-6 transition-colors ${isSearching ? 'text-orange-500 animate-pulse' : 'text-slate-400'}`} />
            </div>
            <input
              type="text"
              placeholder="Search domain (e.g. facebook.com)"
              className="w-full h-14 sm:h-20 bg-[#111]/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl pl-10 sm:pl-16 pr-24 sm:pr-40 text-[13px] sm:text-xl md:text-2xl text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:bg-white/5 transition-all shadow-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-3 bottom-3">
              <button 
                type="submit" 
                disabled={isSearching}
                className="h-full px-3 sm:px-8 bg-orange-500 text-sm sm:text-base hover:bg-orange-400 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {isSearching ? 'Checking...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Popular TLD Tags */}
          <div className="flex flex-wrap justify-center gap-4">
            {domainPricing.slice(0, 4).map((d: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className={`px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 ${getBadgeColor(d.badge_color)}`}
              >
                <span>{d.tld}</span>
                <span className="opacity-60">{d.registration}</span>
              </motion.div>
            ))}
          </div>

          {/* Search Result */}
          <AnimatePresence>
            {searchResult && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`mt-10 p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
                  searchResult.available 
                    ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    searchResult.available ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {searchResult.available ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white break-all">{searchResult.domain}</h3>
                    <p className={`text-sm font-medium ${searchResult.available ? 'text-emerald-400' : 'text-red-400'}`}>
                      {searchResult.error ? searchResult.error : (searchResult.available ? 'Is available! Grab it before someone else does.' : 'Is already taken. Try another name.')}
                    </p>
                  </div>
                </div>
                {searchResult.available && (
                  <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-white/10 pt-6 md:pt-0 shrink-0">
                    <div className="text-2xl font-black text-white">{searchResult.price}</div>
                    <MagneticButton className="w-full md:w-auto px-8 py-3 bg-white text-black hover:bg-slate-200 rounded-xl font-bold text-lg text-center justify-center">
                      Add to Cart
                    </MagneticButton>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedSection>

        {/* Pricing Table Section */}
        <AnimatedSection delay={0.2} className="mb-12 lg:mb-32">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Domain Pricing</h2>
            <p className="text-slate-400">Transparent pricing with no hidden fees.</p>
          </div>

          <div className="bg-transparent md:bg-white/[0.02] md:border border-white/5 rounded-3xl md:overflow-hidden md:backdrop-blur-md md:shadow-2xl flex flex-col gap-4 md:gap-0">
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-5 gap-4 p-6 border-b border-white/5 bg-[#0A0A0B]/50 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <div>Extension</div>
              <div>Register</div>
              <div>Renew</div>
              <div>Transfer</div>
              <div className="text-right">Action</div>
            </div>
            
            <div className="flex flex-col gap-4 md:gap-0 md:divide-y divide-white/5">
              {domainPricing.map((domain: any, i: number) => (
                <div 
                  key={i} 
                  className="bg-[#111] md:bg-transparent border border-white/10 md:border-none rounded-2xl md:rounded-none p-5 sm:p-6 flex flex-col md:grid md:grid-cols-5 gap-4 md:items-center hover:bg-white/[0.04] transition-colors group"
                >
                  {/* Mobile Header / Desktop Col 1 */}
                  <div className="flex items-center justify-between md:justify-start">
                    <span className={`px-4 py-1.5 rounded-full font-bold text-sm border ${getBadgeColor(domain.badge_color)} shadow-lg`}>
                      {domain.tld}
                    </span>
                    {/* Mobile Only Action Button */}
                    <button className="md:hidden px-6 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold active:scale-95 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                      Register
                    </button>
                  </div>

                  {/* Desktop Columns / Mobile Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 md:contents mt-2 md:mt-0">
                    <div className="flex flex-col md:block items-center md:items-start text-center md:text-left bg-[#0a0a0b] md:bg-transparent rounded-xl py-3 md:py-0 border border-white/5 md:border-none">
                      <span className="md:hidden text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Register</span>
                      <div className="text-white font-bold text-base sm:text-lg md:text-lg">{domain.registration}</div>
                    </div>
                    <div className="flex flex-col md:block items-center md:items-start text-center md:text-left bg-[#0a0a0b] md:bg-transparent rounded-xl py-3 md:py-0 border border-white/5 md:border-none">
                      <span className="md:hidden text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Renew</span>
                      <div className="text-slate-400 font-medium text-sm sm:text-base">{domain.renewal}</div>
                    </div>
                    <div className="flex flex-col md:block items-center md:items-start text-center md:text-left bg-[#0a0a0b] md:bg-transparent rounded-xl py-3 md:py-0 border border-white/5 md:border-none">
                      <span className="md:hidden text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Transfer</span>
                      <div className="text-slate-400 font-medium text-sm sm:text-base">{domain.transfer}</div>
                    </div>
                  </div>

                  {/* Desktop Only Action Button */}
                  <div className="hidden md:flex text-right justify-end">
                    <button className="px-5 py-2 rounded-full border border-orange-500/50 text-orange-500 text-sm font-bold group-hover:bg-orange-500 group-hover:text-white transition-all">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Custom High-Performance CSS Animated Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <AnimatedSection delay={0.3}>
            <div className="relative h-full rounded-3xl bg-[#111] p-[2px] group overflow-hidden">
              {/* Spinning Gradient Border Mask - Hardware Accelerated */}
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#f97316_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full bg-[#0d0d0d] rounded-[22px] p-6 lg:p-8 flex flex-col items-start hover:bg-[#111] transition-colors duration-300 z-10">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-orange-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4 group-hover:text-orange-500 transition-colors">Free WHOIS Privacy</h3>
                <p className="text-slate-400 leading-relaxed text-[13px] sm:text-base">
                  Keep your personal contact information hidden from the public WHOIS database for free, forever.
                </p>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Card 2 */}
          <AnimatedSection delay={0.4}>
            <div className="relative h-full rounded-3xl bg-[#111] p-[2px] group overflow-hidden">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#3b82f6_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full bg-[#0d0d0d] rounded-[22px] p-6 lg:p-8 flex flex-col items-start hover:bg-[#111] transition-colors duration-300 z-10">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 lg:w-7 lg:h-7 text-blue-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4 group-hover:text-blue-500 transition-colors">Advanced DNS</h3>
                <p className="text-slate-400 leading-relaxed text-[13px] sm:text-base">
                  Easy-to-use control panel to manage your A, MX, CNAME, and TXT records with global Anycast routing.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Card 3 */}
          <AnimatedSection delay={0.5}>
            <div className="relative h-full rounded-3xl bg-[#111] p-[2px] group overflow-hidden">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#10b981_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full bg-[#0d0d0d] rounded-[22px] p-6 lg:p-8 flex flex-col items-start hover:bg-[#111] transition-colors duration-300 z-10">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <RefreshCcw className="w-6 h-6 lg:w-7 lg:h-7 text-emerald-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4 group-hover:text-emerald-500 transition-colors">Auto-Renewal</h3>
                <p className="text-slate-400 leading-relaxed text-[13px] sm:text-base">
                  Never lose your domain name. Setup automatic renewals with failed payment notifications safely.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>

      </div>
    </div>
  );
}

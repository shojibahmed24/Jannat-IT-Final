import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Monitor, Cpu, HardDrive, Network, Key, 
  TrendingUp, Clock, Shield, ArrowRight, Server, Globe
} from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import MagneticButton from '../components/ui/MagneticButton';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

const MOCK_RDP_PLANS = [
  {
    id: "rdp-1",
    name: "User RDP",
    price: 6.99,
    specs: ["2 vCPU Cores", "4GB RAM", "50GB NVMe", "1Gbps Port", "No Admin Access"],
    popular: false,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=2"
  },
  {
    id: "rdp-2",
    name: "Pro RDP",
    price: 9.99,
    specs: ["4 vCPU Cores", "8GB RAM", "100GB NVMe", "1Gbps Port", "Full Admin Access"],
    popular: false,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=2"
  },
  {
    id: "rdp-3",
    name: "Admin RDP",
    price: 14.99,
    specs: ["6 vCPU Cores", "12GB RAM", "150GB NVMe", "2Gbps Port", "Full Admin Access"],
    popular: true,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=1"
  },
  {
    id: "rdp-4",
    name: "Forex/Botting",
    price: 24.99,
    specs: ["8 vCPU Cores", "16GB RAM", "200GB NVMe", "5Gbps Port", "Full Admin Access"],
    popular: false,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=2"
  }
];

export default function RDPServers() {
  const { settings } = useApp();
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState<any[]>(MOCK_RDP_PLANS);
  const [loading, setLoading] = useState(true);

  const markup = settings?.vpsMarkup || 0;

  useEffect(() => {
    const fetchPlans = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const res = await fetch(`${wpData.apiUrl}jannat-it/v1/plans/rdp`);
          const data = await res.json();
          if (data && data.length > 0) setPlans(data);
        } catch (err) {
          console.error('Failed to fetch RDP plans:', err);
        }
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const calculatePrice = (base: number) => {
    const withMarkup = base * (1 + markup / 100);
    return isYearly ? (withMarkup * 12 * 0.8).toFixed(2) : withMarkup.toFixed(2);
  };

  const getSpecIcon = (spec: string) => {
    const s = spec.toLowerCase();
    if (s.includes('cpu') || s.includes('core')) return <Cpu className="w-5 h-5 text-orange-400" />;
    if (s.includes('ram') || (s.includes('gb') && !s.includes('nvme') && !s.includes('ssd'))) return <Server className="w-5 h-5 text-orange-400" />;
    if (s.includes('nvme') || s.includes('ssd') || s.includes('storage')) return <HardDrive className="w-5 h-5 text-emerald-400" />;
    if (s.includes('bps') || s.includes('network') || s.includes('port')) return <Network className="w-5 h-5 text-orange-400" />;
    if (s.includes('admin')) return <Key className="w-5 h-5 text-yellow-400" />;
    return <Monitor className="w-5 h-5 text-orange-500" />;
  };

  return (
    <div className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative z-10 overflow-hidden bg-[#0A0A0B]">
      
      {/* Abstract Background - Orange Theme to match Brand */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* 1. 3D Floating Hero Section */}
        <AnimatedSection className="mb-12 lg:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 mx-auto lg:mx-0 border border-orange-500/20 text-orange-400 text-sm font-bold mb-8">
                <Monitor className="w-4 h-4 fill-orange-500/50" />
                Windows Remote Desktop
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                High-Performance <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  Windows Servers
                </span>
              </h1>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Lightning-fast remote desktop access with full administrator privileges. Optimized for 24/7 uptime, forex trading, and seamless remote work.
              </p>
              <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4 justify-center lg:justify-start w-full px-4 sm:px-0">
                <a href="#pricing" className="w-full sm:w-auto text-center px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-1">
                  View RDP Plans
                </a>
              </div>
            </div>

            {/* Glassmorphism Windows Mockup */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative mt-12 lg:mt-0 w-full max-w-[300px] sm:max-w-sm mx-auto lg:max-w-none block"
            >
              <div className="relative rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[4/3] ring-1 ring-white/5">
                {/* Mockup Header bar */}
                <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
                    <Monitor className="w-3 h-3" /> 192.168.1.100 - Remote Desktop
                  </div>
                  <div className="w-10" />
                </div>
                {/* Mockup Desktop Area */}
                <div className="absolute inset-x-0 top-10 bottom-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-orange-900/30 mix-blend-overlay" />
                  {/* Desktop Icons */}
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-1 w-16 cursor-pointer group">
                      <div className="w-10 h-10 rounded bg-orange-500/80 shadow flex items-center justify-center text-white group-hover:bg-orange-400">
                        <Monitor className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] text-white font-medium drop-shadow-md">This PC</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 w-16 cursor-pointer group">
                      <div className="w-10 h-10 rounded bg-emerald-500/80 shadow flex items-center justify-center text-white group-hover:bg-emerald-400">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] text-white font-medium drop-shadow-md">MT4/MT5</span>
                    </div>
                  </div>
                  {/* Taskbar */}
                  <div className="absolute bottom-0 inset-x-0 h-12 bg-[#111]/90 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-4">
                    <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-400"><Monitor className="w-4 h-4" /></div>
                    <div className="w-8 h-8 rounded hover:bg-white/10 transition-colors" />
                    <div className="w-8 h-8 rounded hover:bg-white/10 transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* 2. Premium Pricing Cards */}
        <AnimatedSection delay={0.2} className="mb-16 md:mb-32" id="pricing">
          
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">Choose Your RDP</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Deploy a powerful Windows desktop environment in seconds.</p>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="flex justify-center mb-16">
            <div className="bg-[#111] p-1.5 rounded-full inline-flex relative border border-white/5 shadow-2xl">
              <button
                className={`relative z-10 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-colors ${!isYearly ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </button>
              <button
                className={`relative z-10 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 sm:gap-2 ${isYearly ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setIsYearly(true)}
              >
                Yearly
                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>
              </button>
              <motion.div
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                initial={false}
                animate={{ left: isYearly ? '50%' : '6px' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center text-slate-500 py-20 animate-pulse font-bold text-xl">Loading RDP servers...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 items-center px-4 sm:px-0 max-w-full lg:max-w-[95%] xl:max-w-7xl mx-auto">
              {plans.map((plan, i) => (
                <div key={plan.id} className={`relative ${plan.popular ? 'lg:-mt-8 lg:mb-8 z-20' : 'z-10'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 right-8 bg-orange-500 text-white px-4 py-1 rounded-b-lg text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.5)] z-30">
                      Most Popular
                    </div>
                  )}

                  
                  <div className={`h-full rounded-3xl bg-[#111] [clip-path:inset(0_0_0_0_round_1.5rem)] ${plan.popular ? 'p-[2px] shadow-[0_0_40px_rgba(249,115,22,0.2)] transform hover:scale-[1.02] transition-transform' : 'p-6 lg:p-8 border border-white/5 hover:bg-white/[0.04] hover:-translate-y-2 transition-all'} overflow-hidden isolate group`}>
                    
                    {/* Hardware Accelerated Spinning Border for Popular Plan */}
                    {plan.popular && (
                      <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#f97316_360deg)] opacity-100 transition-opacity duration-500" />
                    )}

                    <div className={`relative h-full flex flex-col ${plan.popular ? 'bg-[#0A0A0C] rounded-[22px] p-8' : ''} z-10`}>
                      {plan.popular && (
                        <div className="absolute -top-4 right-8 bg-orange-500 text-white px-4 py-1 rounded-b-lg text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                          Most Popular
                        </div>
                      )}
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-white/10">
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
                          ${calculatePrice(plan.price)}
                        </span>
                        <span className="text-slate-400 font-medium">/{isYearly ? 'yr' : 'mo'}</span>
                      </div>

                      <div className="space-y-5 mb-10 flex-1">
                        {plan.specs.map((spec: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 group/spec">
                            <div className={`p-2 rounded-lg transition-colors ${plan.popular ? 'bg-orange-500/10' : 'bg-white/5 group-hover/spec:bg-white/10'}`}>
                              {getSpecIcon(spec)}
                            </div>
                            <span className="text-slate-300 font-medium">{spec}</span>
                          </div>
                        ))}
                      </div>

                      <MagneticButton className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-auto ${
                        plan.popular 
                          ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}>
                        Deploy RDP <ArrowRight className="w-5 h-5" />
                      </MagneticButton>
                      {plan.orderUrl && <a href={plan.orderUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10"></a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedSection>

        {/* 3. Vercel-style Animated Features */}
        <AnimatedSection delay={0.3} className="mb-16 md:mb-32">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Enterprise RDP Features</h2>
            <p className="text-slate-400">Everything you need for a seamless remote experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="relative h-full rounded-3xl bg-[#111] [clip-path:inset(0_0_0_0_round_1.5rem)] p-[2px] group overflow-hidden">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#eab308_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-[#0d0d0d] rounded-[22px] p-6 lg:p-8 flex flex-col items-start hover:bg-[#111] transition-colors duration-300 z-10">
                <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ring-1 ring-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Key className="w-7 h-7 text-yellow-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-yellow-500 transition-colors">Full Admin Access</h3>
                <p className="text-slate-400 leading-relaxed text-base">
                  Install any software you need. You have complete root/administrator privileges over your Windows environment.
                </p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="relative h-full rounded-3xl bg-[#111] [clip-path:inset(0_0_0_0_round_1.5rem)] p-[2px] group overflow-hidden">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#f97316_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-[#0d0d0d] rounded-[22px] p-6 lg:p-8 flex flex-col items-start hover:bg-[#111] transition-colors duration-300 z-10">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ring-1 ring-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Monitor className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-orange-500 transition-colors">Dedicated Resources</h3>
                <p className="text-slate-400 leading-relaxed text-base">
                  No overselling. Your RAM and CPU cores are 100% dedicated to ensuring a lag-free desktop experience.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative h-full rounded-3xl bg-[#111] [clip-path:inset(0_0_0_0_round_1.5rem)] p-[2px] group overflow-hidden">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#10b981_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-[#0d0d0d] rounded-[22px] p-6 lg:p-8 flex flex-col items-start hover:bg-[#111] transition-colors duration-300 z-10">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-emerald-500 transition-colors">DDoS Protection</h3>
                <p className="text-slate-400 leading-relaxed text-base">
                  Enterprise-grade L3/L4 DDoS mitigation included free of charge to keep your server online 24/7.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 4. Bento Grid Use Cases */}
        <AnimatedSection delay={0.4} className="mb-12 md:mb-20">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-[3rem] p-6 sm:p-6 sm:p-10 lg:p-16">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Why choose our Windows RDP?</h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[
                { icon: <TrendingUp />, title: "Forex Trading", desc: "Run MT4/MT5 bots 24/7" },
                { icon: <Globe />, title: "SEO Tools", desc: "Run ScrapeBox & GSA perfectly" },
                { icon: <Monitor />, title: "Remote Work", desc: "Access your desk from anywhere" },
                { icon: <Clock />, title: "24/7 Botting", desc: "Never sleep, never disconnect" }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#111]/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center border border-white/5 hover:bg-white/5 transition-colors text-center group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-400 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="text-white font-bold text-xs sm:text-sm lg:text-base mb-1 sm:mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-[10px] sm:text-xs lg:text-sm leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}

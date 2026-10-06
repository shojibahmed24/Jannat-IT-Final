import { useSEO } from '../hooks/useSEO';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Server, Cpu, HardDrive, Check, Zap, Shield, Globe, ArrowRight, Network } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTawkChat } from '../hooks/useTawkChat';
import AnimatedSection from '../components/ui/AnimatedSection';
import MagneticButton from '../components/ui/MagneticButton';

const MOCK_DEDICATED_PLANS = [
  {
    id: "power-e3",
    name: "Power E3",
    price: 79.99,
    specs: ["Intel Xeon E3-1230", "4 Cores / 8 Threads", "32 GB RAM", "500 GB NVMe", "1Gbps Unmetered"],
    popular: false,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=2"
  },
  {
    id: "advanced-epyc",
    name: "Advanced Epyc",
    price: 119.99,
    specs: ["AMD EPYC 7232P", "8 Cores / 16 Threads", "64 GB RAM", "1 TB NVMe", "5Gbps Unmetered"],
    popular: false,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=2"
  },
  {
    id: "elite-epyc",
    name: "Elite Epyc",
    price: 169.99,
    specs: ["AMD EPYC 7313P", "16 Cores / 32 Threads", "128 GB RAM", "2x 1TB NVMe", "10Gbps Unmetered"],
    popular: true,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=1"
  },
  {
    id: "titan-dual",
    name: "Titan Dual",
    price: 299.99,
    specs: ["Dual Xeon Gold 6130", "32 Cores / 64 Threads", "256 GB RAM", "4x 2TB NVMe", "10Gbps Unmetered"],
    popular: false,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=2"
  }
];

export default function DedicatedServers() {
  useSEO({ title: 'Dedicated Servers - Jannat IT' });
  const { settings } = useApp();
  const { openChat } = useTawkChat();
  const [plans, setPlans] = useState<any[]>(MOCK_DEDICATED_PLANS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const res = await fetch(`${wpData.apiUrl}jannat-it/v1/plans/dedicated`);
          const data = await res.json();
          if (data && data.length > 0) setPlans(data);
        } catch (err) {
          console.error('Failed to fetch Dedicated plans:', err);
        }
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const getSpecIcon = (spec: string) => {
    const s = spec.toLowerCase();
    if (s.includes('cpu') || s.includes('core') || s.includes('xeon') || s.includes('epyc')) return <Cpu className="w-5 h-5 text-orange-400" />;
    if (s.includes('ram') || s.includes('gb')) return <Server className="w-5 h-5 text-orange-400" />;
    if (s.includes('nvme') || s.includes('ssd') || s.includes('storage')) return <HardDrive className="w-5 h-5 text-emerald-400" />;
    if (s.includes('bps') || s.includes('unmetered') || s.includes('port')) return <Network className="w-5 h-5 text-orange-400" />;
    return <Check className="w-5 h-5 text-orange-500" />;
  };

  return (
    <div className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative z-10 overflow-hidden bg-[#0A0A0B]">
      
      {/* Brand Theme Orange Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff02_25%,transparent_25%,transparent_50%,#ffffff02_50%,#ffffff02_75%,transparent_75%,transparent)] bg-[length:64px_64px] pointer-events-none opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* 1. Heavy Iron Hero Section */}
        <AnimatedSection className="mb-12 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold mb-8 shadow-inner mx-auto lg:mx-0">
                <Server className="w-4 h-4" />
                Bare Metal Compute
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight uppercase">
                Raw Power. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  Zero Overhead.
                </span>
              </h1>
              <p className="text-xl text-slate-400 mb-8 sm:mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Enterprise-grade dedicated servers with 100% hardware isolation. Custom deploy your stack with IPMI access and unmetered bandwidth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0 justify-center lg:justify-start">
                <a href="#pricing" className="w-full sm:w-auto text-center px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  View Bare Metal
                </a>
              </div>
            </div>

            {/* CSS Server Rack Animation */}
            <div className="flex justify-center lg:justify-end relative h-[300px] sm:h-[350px] lg:h-[400px] mt-12 lg:mt-0 transform scale-90 lg:scale-100 origin-center lg:origin-right w-full">
              <div className="w-full max-w-full max-w-[280px] h-[360px] bg-[#111] rounded-t-md border-x-4 border-t-4 border-orange-500/20 shadow-[20px_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
                {/* Rack Mounting Rails */}
                <div className="absolute left-2 top-0 bottom-0 w-2 bg-black border-r border-white/5" />
                <div className="absolute right-2 top-0 bottom-0 w-2 bg-black border-l border-white/5" />

                {/* Server Units */}
                <div className="absolute inset-x-4 top-4 bottom-4 flex flex-col gap-2">
                  {[1, 2, 3, 4, 5].map((unit) => (
                    <motion.div 
                      key={unit}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + (unit * 0.1), duration: 0.5 }}
                      className="h-14 bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-white/10 rounded-sm relative shadow-md"
                    >
                      {/* Unit Grille */}
                      <div className="absolute left-4 top-2 bottom-2 w-24 flex flex-col justify-between opacity-50">
                        <div className="h-[1px] w-full bg-black" />
                        <div className="h-[1px] w-full bg-black" />
                        <div className="h-[1px] w-full bg-black" />
                        <div className="h-[1px] w-full bg-black" />
                      </div>
                      
                      {/* Blinking LEDs */}
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                        <div className={`w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_5px_#f97316] ${unit % 2 === 0 ? 'animate-[pulse_1s_infinite]' : 'animate-[pulse_0.5s_infinite]'}`} />
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6] animate-[pulse_2s_infinite]" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </AnimatedSection>

        {/* 2. Brutalist Pricing Cards (Updated for 4 cards) */}
        <AnimatedSection delay={0.2} className="mb-12 lg:mb-32" id="pricing">
          
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl lg:text-4xl lg:text-5xl font-black text-white mb-6">Dedicated Compute</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">No noisy neighbors. 100% hardware dedication.</p>
          </div>

          {loading ? (
            <div className="text-center text-slate-500 py-20 animate-pulse font-bold text-xl">Loading servers...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 items-center px-4 sm:px-0 max-w-full lg:max-w-[95%] xl:max-w-7xl mx-auto">
              {plans.map((plan, i) => (
                <div key={plan.id} className={`relative ${plan.popular ? 'lg:-mt-6 lg:mb-6 z-20' : 'z-10'}`}>
                  
                  {plan.popular && (
                    <div className="absolute -inset-1 bg-gradient-to-b from-orange-500 to-transparent rounded-[26px] opacity-30 animate-pulse blur-md" />
                  )}

                  <div className={`relative h-full rounded-3xl p-6 lg:p-8 transition-transform duration-500 flex flex-col ${
                    plan.popular 
                      ? 'bg-[#151515] border border-orange-500/50 transform hover:scale-[1.02]' 
                      : 'bg-[#0f0f11] border border-white/5 hover:bg-[#131315] hover:-translate-y-2'
                  }`}>
                    
                    {plan.popular && (
                      <div className="absolute -top-3 right-8 bg-orange-500 text-white px-4 py-1 rounded-sm text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                        Best Value
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-white/10">
                      <span className="text-4xl lg:text-5xl font-black text-white">
                        ${plan.price}
                      </span>
                      <span className="text-slate-500 font-medium">/mo</span>
                    </div>

                    <div className="space-y-4 mb-10 flex-1">
                      {plan.specs.map((spec: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className={`p-2 rounded bg-white/5 border border-white/10`}>
                            {getSpecIcon(spec)}
                          </div>
                          <span className="text-slate-300 font-medium text-sm sm:text-base">{spec}</span>
                        </div>
                      ))}
                    </div>

                    <MagneticButton className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all mt-auto ${
                      plan.popular 
                        ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}>
                      Order Server <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedSection>

        {/* 3. Enterprise Features (Elegant Fade/Slide) */}
        <AnimatedSection delay={0.3} className="mb-10 lg:mb-20">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase">Enterprise DNA</h2>
            <p className="text-slate-400">Built for mission-critical applications that demand the best.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
            {[
              { icon: <Zap className="w-6 h-6 text-orange-500" />, title: "Instant Deployment", desc: "Automated provisioning means your bare metal server is racked, wired, and online within 15 minutes of payment." },
              { icon: <Shield className="w-6 h-6 text-orange-500" />, title: "Hardware RAID", desc: "Custom hardware RAID 1/5/10 configurations available directly from the checkout for maximum data redundancy." },
              { icon: <Globe className="w-6 h-6 text-red-500" />, title: "Free KVM / IPMI", desc: "Out-of-band management comes standard. Reboot, reinstall the OS, or access the BIOS remotely anytime." }
            ].map((feat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/10 p-6 lg:p-8 rounded-2xl group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center mb-6 shadow-inner group-hover:bg-orange-500/20 transition-colors">
                  {feat.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed text-[13px] sm:text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Support CTA */}
        <AnimatedSection delay={0.4} className="mb-10 lg:mb-20">
          <div className="bg-orange-500/10 border border-orange-500/20 p-6 sm:p-10 rounded-2xl sm:rounded-3xl mx-4 lg:mx-0 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Need a custom hardware configuration?</h3>
              <p className="text-slate-400">Our sales engineers can build a server exactly to your specifications.</p>
            </div>
            <button 
              onClick={openChat}
              className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            >
              Contact Sales
            </button>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}

import { useSEO } from '../hooks/useSEO';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, Cpu, HardDrive, Network, Server, 
  Zap, Globe, Shield, Activity, ArrowRight
} from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import GlowCard from '../components/ui/GlowCard';
import MagneticButton from '../components/ui/MagneticButton';
import { useApp } from '../context/AppContext';

const MOCK_VPS_PLANS = [
  {
    id: "vps-1",
    name: "Starter Cloud",
    price: 4.99,
    specs: ["1 vCPU Core", "2GB RAM", "40GB NVMe SSD", "1Gbps Network"],
    popular: false,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=2"
  },
  {
    id: "vps-2",
    name: "Professional",
    price: 9.99,
    specs: ["2 vCPU Cores", "4GB RAM", "80GB NVMe SSD", "2Gbps Network"],
    popular: false,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=2"
  },
  {
    id: "vps-3",
    name: "Business",
    price: 14.99,
    specs: ["4 vCPU Cores", "8GB RAM", "160GB NVMe SSD", "5Gbps Network"],
    popular: true,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=1"
  },
  {
    id: "vps-4",
    name: "Enterprise",
    price: 29.99,
    specs: ["8 vCPU Cores", "16GB RAM", "320GB NVMe SSD", "10Gbps Network"],
    popular: false,
    orderUrl: "https://my.jannatit.net/cart.php?a=add&pid=2"
  }
];

export default function VPSHosting() {
  useSEO({ title: 'Premium VPS Hosting - Jannat IT' });
  const { settings } = useApp();
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState<any[]>(MOCK_VPS_PLANS);
  const [loading, setLoading] = useState(true);

  const markup = settings?.vpsMarkup || 0;

  useEffect(() => {
    const fetchPlans = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const res = await fetch(`${wpData.apiUrl}jannat-it/v1/plans/vps`);
          const data = await res.json();
          if (data && data.length > 0) setPlans(data);
        } catch (err) {
          console.error('Failed to fetch VPS plans:', err);
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
    if (s.includes('ram') || (s.includes('gb') && !s.includes('nvme') && !s.includes('ssd'))) return <Server className="w-5 h-5 text-blue-400" />;
    if (s.includes('nvme') || s.includes('ssd') || s.includes('storage')) return <HardDrive className="w-5 h-5 text-emerald-400" />;
    if (s.includes('bps') || s.includes('network') || s.includes('bandwidth')) return <Network className="w-5 h-5 text-purple-400" />;
    return <CheckCircle2 className="w-5 h-5 text-orange-500" />;
  };

  const osList = [
    { name: 'Ubuntu', color: 'bg-[#E95420]' },
    { name: 'Debian', color: 'bg-[#A81D33]' },
    { name: 'CentOS', color: 'bg-[#262577]' },
    { name: 'AlmaLinux', color: 'bg-[#2D3142]' },
    { name: 'Windows Server', color: 'bg-[#0078D6]' },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative z-10 overflow-hidden bg-[#0A0A0B]">
      
      {/* Abstract Grid Background with subtle moving gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* 1. Dynamic Hero Section */}
        <AnimatedSection className="mb-12 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-1 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-bold mb-8 mx-auto lg:mx-0">
                <Zap className="w-4 h-4 fill-orange-500" />
                High-Speed NVMe Cloud VPS
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                Deploy High-Performance <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Cloud Instances
                </span>
              </h1>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Buy cheap VPS hosting powered by AMD EPYC™ processors and 100% NVMe storage, and a blazing fast 10Gbps network. Provisioned in 60 seconds.
              </p>

              {/* OS Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {osList.map((os, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    className={`px-4 py-1.5 rounded-full text-white font-bold text-xs shadow-lg flex items-center gap-2 ${os.color}/20 border border-white/10`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${os.color} shadow-[0_0_8px_currentColor]`} />
                    {os.name}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cloud Abstract Animation - "Data Nodes" */}
            <div className="order-2 lg:order-2 flex justify-center lg:justify-end relative h-[280px] sm:h-[300px] lg:h-[350px] mt-8 lg:mt-0 w-full transform scale-[0.8] sm:scale-90 lg:scale-100 origin-center lg:origin-right">
              <div className="relative w-full max-w-[400px] h-full flex items-center justify-center">
                
                {/* Center Node */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute z-20 w-24 h-24 bg-[#111] rounded-3xl border-2 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.3)] flex items-center justify-center"
                >
                  <Server className="w-10 h-10 text-orange-500" />
                </motion.div>

                {/* Orbiting / Connected Nodes */}
                {[
                  { icon: <Globe className="w-5 h-5 text-blue-400" />, delay: 0, pos: '-top-4 left-10' },
                  { icon: <Database className="w-5 h-5 text-emerald-400" />, delay: 1, pos: 'top-20 -right-4' },
                  { icon: <Shield className="w-5 h-5 text-purple-400" />, delay: 2, pos: '-bottom-6 left-20' }
                ].map((node, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -15, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, delay: node.delay, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute z-10 w-14 h-14 bg-[#111]/80 backdrop-blur border border-white/10 rounded-2xl flex items-center justify-center ${node.pos}`}
                  >
                    {node.icon}
                  </motion.div>
                ))}

                {/* Faint Connecting Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 350">
                  <motion.path 
                    d="M140,70 L200,175 L280,120 M200,175 L180,260" 
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth="2" 
                    strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [0, -40] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </svg>

                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-blue-500/10 rounded-full blur-3xl animate-pulse" />
              </div>
            </div>

          </div>
        </AnimatedSection>

        {/* 2. Premium Pricing Cards */}
        <AnimatedSection delay={0.2} className="mb-12 lg:mb-32">
          
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">Transparent Pricing</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Scalable compute resources for projects of all sizes.</p>
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
            <div className="text-center text-slate-500 py-20 animate-pulse font-bold text-xl">Loading instances...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 items-center px-4 sm:px-0 max-w-full lg:max-w-[95%] xl:max-w-7xl mx-auto">
              {plans.map((plan, i) => (
                <div key={plan.id} className={`relative ${plan.popular ? 'lg:-mt-8 lg:mb-8 z-20' : 'z-10'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest z-20 shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`h-full rounded-3xl p-6 lg:p-8 transition-all duration-500 overflow-hidden group ${
                    plan.popular 
                      ? 'bg-[#1A1110] border border-orange-500/50 shadow-[0_0_40px_rgba(249,115,22,0.15)] transform hover:scale-[1.02]' 
                      : 'bg-[#111] border border-white/5 hover:bg-white/[0.04] hover:-translate-y-2'
                  }`}>
                    
                    {/* "Shimmer" sweep effect on popular plan (very subtle, runs every 4s) */}
                    {plan.popular && (
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                    )}

                    <div className="relative z-10 flex flex-col h-full">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
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
                            <span className="text-slate-300 font-medium text-sm sm:text-base">{spec}</span>
                          </div>
                        ))}
                      </div>

                      <MagneticButton className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all mt-auto ${
                        plan.popular 
                          ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}>
                        Deploy Now <ArrowRight className="w-5 h-5" />
                      </MagneticButton>
                      {plan.orderUrl && <a href={plan.orderUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10"></a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedSection>

        {/* 3. Under the Hood Performance (New Clean Look) */}
        <AnimatedSection delay={0.3} className="mb-12 lg:mb-32">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">Under The Hood</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">We don't compromise on hardware. Every VPS is powered by industry-leading enterprise components.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
            {/* Elegant glass cards with a subtle bottom-border glow on hover */}
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col hover:bg-white/[0.04] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <Cpu className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">AMD EPYC™</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                Experience unparalleled processing power with the latest generation AMD EPYC™ architecture.
              </p>
              
              <div className="mt-auto">
                <div className="w-full bg-black/50 rounded-full h-1.5 mb-2 overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-orange-600 to-orange-400 h-1.5 rounded-full w-[90%] shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                </div>
                <div className="text-xs font-bold text-orange-500 text-right uppercase tracking-widest">Top Tier CPU</div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col hover:bg-white/[0.04] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <HardDrive className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">100% NVMe SSD</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                Up to 10x faster than standard SSDs. Your applications will load instantly with lightning-fast I/O.
              </p>
              
              <div className="mt-auto">
                <div className="w-full bg-black/50 rounded-full h-1.5 mb-2 overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5 rounded-full w-[95%] shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                </div>
                <div className="text-xs font-bold text-blue-500 text-right uppercase tracking-widest">Ultra Fast I/O</div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col hover:bg-white/[0.04] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <Network className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">10Gbps Uplink</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                Never worry about bandwidth bottlenecks. Our enterprise network guarantees low latency globally.
              </p>
              
              <div className="mt-auto">
                <div className="w-full bg-black/50 rounded-full h-1.5 mb-2 overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-1.5 rounded-full w-[85%] shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                </div>
                <div className="text-xs font-bold text-purple-500 text-right uppercase tracking-widest">High Bandwidth</div>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}

// A simple local Database icon since it might not be imported above
function Database(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )
}

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Monitor, Cpu, HardDrive, Check, Zap, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RDP_PLANS = [
  {
    id: "4gb-rdp",
    name: "4GB RDP",
    price: 16.20,
    oldPrice: 28.33,
    specs: ["2 vCPU Cores", "4 GB DDR4 RAM", "80 GB SSD", "10Gbps Network", "Windows 2019/2022"],
  },
  {
    id: "8gb-rdp",
    name: "8GB RDP",
    price: 29.99,
    oldPrice: 57.49,
    specs: ["4 vCPU Cores", "8 GB DDR4 RAM", "160 GB SSD", "10Gbps Network", "Windows 2019/2022"],
    popular: true
  },
  {
    id: "16gb-rdp",
    name: "16GB RDP",
    price: 47.99,
    oldPrice: 95.99,
    specs: ["8 vCPU Cores", "16 GB DDR4 RAM", "320 GB NVMe", "10Gbps Network", "Windows 2019/2022"],
  }
];

export default function RDPServers() {
  const { settings } = useApp();
  const [isYearly, setIsYearly] = React.useState(false);
  const markup = settings?.vpsMarkup || 0;

  const calculatePrice = (base: number) => {
    const withMarkup = base * (1 + markup / 100);
    return isYearly ? (withMarkup * 0.8).toFixed(2) : withMarkup.toFixed(2);
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
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-orange-600/10 border border-orange-500/20 rounded-2xl text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
            10Gbps Network Standard
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-white mb-6 tracking-tighter">High Speed RDP Servers</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Optimized for remote work, browsing, and heavy-duty applications with low latency and dedicated resources.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold uppercase tracking-widest transition-colors ${!isYearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 rounded-full bg-white/5 border border-white/10 relative p-1 transition-all"
            >
              <motion.div 
                animate={{ x: isYearly ? '2rem' : '0' }}
                className="w-6 h-6 bg-orange-600 rounded-full shadow-lg shadow-orange-600/40" 
              />
            </button>
            <span className={`text-sm font-bold uppercase tracking-widest transition-colors ${isYearly ? 'text-white' : 'text-slate-500'}`}>
              Yearly <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {RDP_PLANS.map((plan, idx) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] ${plan.popular ? 'border-orange-500/50 bg-orange-600/[0.05] glow-orange-strong' : 'glass-card border-white/5 hover:border-white/20'} relative group overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-orange-600 text-[10px] font-black text-white uppercase tracking-[0.2em] rounded-bl-2xl shadow-lg shadow-orange-600/40">
                  Most Popular
                </div>
              )}

              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{plan.name}</h3>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Enterprise Grade</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-500">
                  <Monitor className="w-6 h-6" />
                </div>
              </div>

              <div className="flex flex-col mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    ${calculatePrice(plan.price)}
                  </span>
                  <span className="text-slate-500 font-bold text-sm">/{isYearly ? 'year' : 'month'}</span>
                </div>
                <span className="text-slate-500 line-through text-xs mt-1 font-bold">
                  ${calculatePrice(plan.oldPrice)}
                </span>
              </div>

              <ul className="space-y-4 mb-12">
                {plan.specs.map(spec => (
                  <li key={spec} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-orange-500/50 transition-colors">
                      <Check className="w-3 h-3 text-orange-500" />
                    </div>
                    {spec}
                  </li>
                ))}
              </ul>
              
              <Link 
                to={`/configure/${plan.id}`}
                className={`w-full py-4 rounded-2xl font-black transition-all text-center block uppercase tracking-widest text-xs ${
                  plan.popular 
                    ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-600/30' 
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
              >
                Order Now
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="glass-card rounded-3xl p-12 border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/5 blur-3xl -ml-48 -mt-48" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why Choose Our RDP?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-orange-500">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Ultra Low Latency</h4>
                    <p className="text-slate-400 text-sm">Our 10Gbps premium network ensures smooth experience regardless of your location.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-orange-500">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Pre-installed Software</h4>
                    <p className="text-slate-400 text-sm">Comes with essential tools pre-installed so you can start working immediately.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-orange-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Admin Access</h4>
                    <p className="text-slate-400 text-sm">Full administrative rights allow you to install any software you need.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="h-6 bg-white/5 border-b border-white/5 flex items-center px-3 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="p-4 font-mono text-[10px] text-orange-500/50">
                  {`> Jannat IT RDP Session Started...`} <br />
                  {`> Connecting to 10Gbps Uplink... OK`} <br />
                  {`> Initializing Windows Desktop... OK`} <br />
                  {`> Systems Nominal.`}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-600 rounded-full blur-3xl opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

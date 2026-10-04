import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Cpu, HardDrive, Zap, Shield, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

const VPS_PLANS = [
  {
    id: "starter-vps",
    name: "Starter VPS",
    price: 4.99,
    specs: ["1 vCPU Core", "2 GB RAM", "40 GB SSD", "1 TB Bandwidth", "1 IPv4 Address"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "business-vps",
    name: "Business VPS",
    price: 12.99,
    specs: ["2 vCPU Cores", "4 GB RAM", "80 GB SSD", "2 TB Bandwidth", "1 IPv4 Address"],
    color: "from-orange-500 to-red-600",
    popular: true
  },
  {
    id: "enterprise-vps",
    name: "Enterprise VPS",
    price: 24.99,
    specs: ["4 vCPU Cores", "8 GB RAM", "160 GB NVMe", "4 TB Bandwidth", "2 IPv4 Addresses"],
    color: "from-purple-500 to-indigo-600"
  }
];

export default function VPSHosting() {
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-500/20 text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-8">
            Enterprise Cloud VPS
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-white mb-6 tracking-tighter">Cloud VPS Hosting</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
            High-performance virtual servers with full root access, instant setup, and 99.9% uptime.
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
          {VPS_PLANS.map((plan, idx) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] ${plan.popular ? 'border-orange-500/50 bg-orange-600/[0.05] glow-orange-strong' : 'glass-card border-white/5 hover:border-white/20'} relative overflow-hidden group`}
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
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-black text-white tracking-tighter">
                  ${calculatePrice(plan.price)}
                </span>
                <span className="text-slate-500 font-bold text-sm">/{isYearly ? 'year' : 'month'}</span>
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
                Deploy Now
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5">
            <Cpu className="w-8 h-8 text-orange-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Full Root Access</h3>
            <p className="text-slate-400 text-sm">
              Complete control over your server environment with SSH access for Linux and RDP for Windows.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5">
            <Zap className="w-8 h-8 text-orange-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">NVMe SSD Storage</h3>
            <p className="text-slate-400 text-sm">
              Experience blazing fast I/O speeds with our enterprise-grade NVMe solid state drives.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5">
            <Shield className="w-8 h-8 text-orange-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Weekly Backups</h3>
            <p className="text-slate-400 text-sm">
              Your data is safe with us. We perform automated weekly backups for all VPS instances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

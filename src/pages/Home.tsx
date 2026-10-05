import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Globe, 
  Clock, 
  Headphones, 
  Cpu, 
  HardDrive, 
  Check, 
  ChevronRight,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

const PLANS = [
  {
    id: "standard-vps",
    name: "Standard VPS",
    price: 6.99,
    specs: ["2 GB RAM", "2 vCPU Cores", "40 GB SSD", "Unlimited Bandwidth"],
    recommended: false,
    color: "blue",
    comp: {
      cpu: "2 vCPU",
      ram: "2 GB",
      storage: "40 GB SSD",
      port: "1 Gbps",
      ip: "1 IPv4",
      os: "Linux Only"
    }
  },
  {
    id: "premium-rdp",
    name: "Premium RDP",
    price: 16.20,
    specs: ["4 GB RAM", "4 vCPU Cores", "80 GB NVMe", "10Gbps Network"],
    recommended: true,
    color: "orange",
    comp: {
      cpu: "4 vCPU",
      ram: "4 GB",
      storage: "80 GB NVMe",
      port: "10 Gbps",
      ip: "1 IPv4 + IPv6",
      os: "Win/Linux"
    }
  },
  {
    id: "dedicated-server",
    name: "Dedicated Server",
    price: 79.99,
    specs: ["32 GB RAM", "8 vCPU Cores", "1 TB NVMe", "Dedicated Uplink"],
    recommended: false,
    color: "purple",
    comp: {
      cpu: "8-32 vCPU",
      ram: "32-512 GB",
      storage: "1-10 TB NVMe",
      port: "Dedicated 10Gbps",
      ip: "Up to 5 IPv4",
      os: "Any OS + ISO"
    }
  },
  {
    id: "ultimate-vps",
    name: "Ultimate VPS",
    price: 49.99,
    specs: ["16 GB RAM", "8 vCPU Cores", "250 GB NVMe", "Unlimited Bandwidth"],
    recommended: false,
    color: "emerald",
    comp: {
      cpu: "8 vCPU",
      ram: "16 GB",
      storage: "250 GB NVMe",
      port: "10 Gbps",
      ip: "2 IPv4",
      os: "Win/Linux"
    }
  }
];

const COMPARISON_FEATURES = [
  { key: 'cpu', label: 'CPU Cores' },
  { key: 'ram', label: 'Memory (RAM)' },
  { key: 'storage', label: 'Storage' },
  { key: 'port', label: 'Network Port' },
  { key: 'ip', label: 'IP Addresses' },
  { key: 'os', label: 'OS Support' },
];

const FAQS = [
  {
    q: "How fast is the server setup?",
    a: "Our instant provisioning system deploys your VPS or RDP instance within 60 seconds of successful payment. Dedicated servers typically take 1-4 hours depending on customization."
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept PayPal, Credit/Debit Cards (Stripe), Bitcoin (BTC), Ethereum (ETH), and local methods like bKash, Rocket, and Nagad."
  },
  {
    q: "Can I upgrade my plan later?",
    a: "Yes, you can upgrade your RAM, CPU, or Storage at any time directly from your client dashboard. The changes are applied instantly without data loss."
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "Yes, we provide a 7-day money-back guarantee if you are not satisfied with our service quality. No questions asked."
  },
  {
    q: "Is my data safe with Jannat IT?",
    a: "Absolutely. We use RAID 10 storage for data redundancy and perform weekly off-site backups for all VPS and RDP plans."
  }
];

const FEATURES = [
  {
    title: "99.9% Uptime Guarantee",
    description: "Our enterprise-grade infrastructure ensures your services remain online 24/7 without interruption.",
    icon: Clock
  },
  {
    title: "Instant Provisioning",
    description: "Your VPS or RDP instance is deployed automatically within minutes of your successful payment.",
    icon: Zap
  },
  {
    title: "Global Data Centers",
    description: "Strategically located servers across the US, Europe, and Asia for low-latency performance.",
    icon: Globe
  },
  {
    title: "DDoS Protection",
    description: "All plans include advanced layer 7 DDoS mitigation to keep your data safe from malicious attacks.",
    icon: Shield
  }
];

export default function Home() {
  const { settings, links } = useApp();
  const [isYearly, setIsYearly] = React.useState(false);
  const [stats, setStats] = React.useState<any>(null);
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const markup = settings?.vpsMarkup || 0;

  const calculatePrice = (base: number) => {
    const withMarkup = base * (1 + markup / 100);
    return isYearly ? (withMarkup * 12 * 0.8).toFixed(2) : withMarkup.toFixed(2);
  };

  React.useEffect(() => {
    fetch('/api/system/status')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  const getPlanLink = (planId: string) => {
    return links[planId.replace(/-/g, '_') + '_link'] || links['order_now'] || 'https://billing.jannatit.com/cart.php?a=add&pid=1';
  };

  const toggleChat = () => {
    if ((window as any).Tawk_API) {
      (window as any).Tawk_API.toggle();
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-32 overflow-hidden bg-[#0A0A0B]">
        {/* Background Decorative Gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,77,0,0.05)_0%,_transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md">
              <div className="flex text-yellow-500">
                <span className="text-sm">★</span>
              </div>
              <span className="text-xs font-bold text-white">4.8/5</span>
              <span className="text-[10px] text-slate-500 font-medium">on HostAdvice</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md">
              <div className="flex text-yellow-500">
                <span className="text-sm">★</span>
              </div>
              <span className="text-xs font-bold text-white">3.8/5</span>
              <span className="text-[10px] text-slate-500 font-medium">on Trustpilot</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-xs font-bold text-white">7-day</span>
              <span className="text-[10px] text-slate-500 font-medium">money-back guarantee</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight leading-[1.1]">
              Fast Windows RDP & <br /> VPS
            </h1>
            
            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-[#FF4D00] mb-8">
              from $6.99/month
            </div>

            <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-medium">
              jannatit.net delivers high-performance Windows RDP, Linux VPS, and business email hosting from 16 data centers worldwide — with full admin access and 24/7 support.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a 
                href={links['order_now'] || '#pricing'} 
                className="w-full sm:w-auto px-10 py-4 bg-[#FF4D00] hover:bg-[#FF6A00] text-white font-bold rounded-xl transition-all shadow-xl shadow-orange-600/20 text-lg hover:shadow-[#FF4D00]/40 hover:scale-[1.02] active:scale-95"
              >
                See Plans & Pricing
              </a>
              <button 
                onClick={toggleChat}
                className="w-full sm:w-auto px-10 py-4 border border-white/10 hover:bg-white/5 text-white font-bold rounded-xl transition-all text-lg hover:border-[#FF4D00]/30 hover:text-white"
              >
                Chat With Sales
              </button>
            </div>

            {/* Bottom Features */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                No setup fee
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                99.9% uptime SLA
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Instant provisioning
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hardware Bento Grid */}
      <section className="py-12 md:py-24 bg-[#0A0A0B] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-black text-[#FF4D00] uppercase tracking-[0.3em] mb-4">The Infrastructure</h2>
            <p className="text-4xl md:text-5xl font-black text-white tracking-tight">Enterprise Grade Backbone</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* CPU - Large Bento */}
            <div className="md:col-span-4 lg:col-span-4 p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6 border border-orange-500/20">
                  <Cpu className="w-6 h-6 text-[#FF4D00]" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">AMD EPYC™ 7003 Processors</h3>
                <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-6">
                  Experience unmatched multi-threaded performance with the latest Milan architecture. High clock speeds and massive L3 cache for demanding workloads.
                </p>
                <div className="flex gap-4">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">3.5GHz Turbo</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">Milan Architecture</div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#FF4D00]/10 rounded-full blur-[100px] group-hover:bg-[#FF4D00]/20 transition-all duration-700" />
              <div className="absolute right-12 bottom-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Cpu className="w-48 h-48 text-white" />
              </div>
            </div>

            {/* RAM */}
            <div className="md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-white/5 group relative overflow-hidden">
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/10">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">DDR4 ECC RAM</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Error-Correcting Code memory for maximum stability and data integrity.
              </p>
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="text-2xl font-black text-white tracking-tighter">3200 MT/s</div>
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Memory Speed</div>
              </div>
            </div>

            {/* Storage */}
            <div className="md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-white/5 group relative overflow-hidden">
              <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/10">
                <HardDrive className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gen4 NVMe</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Blazing fast I/O performance with Enterprise NVMe SSDs in RAID 10.
              </p>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-black text-white tracking-tighter">7,500 MB/s</div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Read Speed</div>
                </div>
                <div className="h-10 w-20 flex items-end gap-1 pb-1">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-500/30 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Network */}
            <div className="md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-white/5 group relative overflow-hidden">
              <div className="w-10 h-10 bg-[#FF4D00]/10 rounded-xl flex items-center justify-center mb-6 border-[#FF4D00]/10">
                <Globe className="w-5 h-5 text-[#FF4D00]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">10Gbps Uplink</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Redundant fiber-optic backbone with multiple Tier 1 carriers.
              </p>
              <div className="mt-8 flex justify-center py-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-white/5 border-t-[#FF4D00] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">LOW</div>
                </div>
              </div>
            </div>

            {/* Uptime */}
            <div className="md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-white/5 group relative overflow-hidden">
              <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center mb-6 border-purple-500/10">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Tier 3+ DC</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                N+1 Redundant power and cooling in strategically located facilities.
              </p>
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="text-3xl font-black text-emerald-500 tracking-tighter">99.99%</div>
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Uptime Record</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-32 relative overflow-hidden bg-[#0A0A0B]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[160px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tighter">Choose Your Power</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
                Scalable infrastructure tailored to your needs. From <span className="text-orange-500 font-bold">SSD VPS</span> to high-performance <span className="text-orange-500 font-bold">NVMe Dedicated</span> resources.
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {PLANS.map((plan, idx) => (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={`relative p-10 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] ${
                  plan.recommended 
                    ? 'border-orange-500/50 bg-gradient-to-b from-orange-600/[0.08] to-transparent glow-orange-strong' 
                    : 'glass-card border-white/5 hover:border-white/20'
                } group`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-orange-600 text-[10px] font-black text-white rounded-full uppercase tracking-[0.2em] shadow-xl shadow-orange-600/40">
                    Most Popular
                  </div>
                )}

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{plan.name}</h3>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Enterprise Grade</div>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    plan.color === 'orange' ? 'bg-orange-600/20 text-orange-500' :
                    plan.color === 'blue' ? 'bg-blue-600/20 text-blue-500' :
                    'bg-purple-600/20 text-purple-500'
                  }`}>
                    <Zap className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    ${calculatePrice(plan.price)}
                  </span>
                  <span className="text-slate-500 font-bold text-sm">/{isYearly ? 'year' : 'month'}</span>
                </div>

                <div className="space-y-4 mb-12">
                  {plan.specs.map(spec => (
                    <div key={spec} className="flex items-center gap-3 text-slate-300 group/item">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/item:border-orange-500/50 transition-colors">
                        <Check className="w-3 h-3 text-orange-500" />
                      </div>
                      <span className="text-sm font-medium">{spec}</span>
                    </div>
                  ))}
                </div>

                <a 
                  href={getPlanLink(plan.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-2xl font-black transition-all text-center block uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 ${
                    plan.recommended 
                      ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-600/30 hover:shadow-orange-500/50' 
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  Deploy Instance
                </a>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-32 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="py-6 px-4 text-sm font-black text-slate-500 uppercase tracking-widest">Core Features</th>
                  {PLANS.map(plan => (
                    <th key={plan.id} className={`py-6 px-4 text-lg font-black ${plan.recommended ? 'text-[#FF4D00]' : 'text-white'}`}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {COMPARISON_FEATURES.map((feature, i) => (
                  <tr key={feature.key} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-5 px-4 font-bold text-sm">{feature.label}</td>
                    {PLANS.map(plan => (
                      <td key={plan.id} className={`py-5 px-4 text-sm ${plan.recommended ? 'font-bold text-white group-hover:text-[#FF4D00]' : ''} transition-colors`}>
                        {(plan.comp as any)[feature.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-32 bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl glass-card border-white/5 hover:border-orange-500/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-600/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <feature.icon className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-glow transition-all">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs Bento */}
      <section className="py-16 md:py-32 relative overflow-hidden bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-12 rounded-[2.5rem] bg-gradient-to-br from-orange-600/20 via-red-600/10 to-transparent border border-orange-500/20 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">Enterprise Grade Hardware</h2>
                <p className="text-slate-300 max-w-md text-lg mb-10 leading-relaxed font-medium">
                  We only use the latest <span className="text-orange-500">AMD EPYC</span> and <span className="text-orange-500">Intel Xeon</span> Scalable processors combined with enterprise Gen4 NVMe storage.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 group-hover:border-orange-500/30 transition-all">
                    <Cpu className="w-8 h-8 text-orange-500 mb-4" />
                    <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Processors</div>
                    <div className="font-bold text-white text-lg">3.5GHz+ Turbo</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 group-hover:border-orange-500/30 transition-all">
                    <HardDrive className="w-8 h-8 text-orange-500 mb-4" />
                    <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Storage</div>
                    <div className="font-bold text-white text-lg">Pure Gen4 NVMe</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-orange-600/20 transition-all duration-700" />
            </div>

            <div className="p-12 rounded-[2.5rem] glass-card border-white/5 flex flex-col justify-center relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="text-orange-500 font-black text-7xl mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(234,88,12,0.3)]">10<span className="text-3xl">Gbps</span></div>
                <div className="text-white font-black text-2xl mb-6 tracking-tight uppercase tracking-widest">Ultra-Fast Uplink</div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Our network backbone features massive capacity with redundant carriers to ensure zero congestion even during peak loads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-32 bg-[#0A0A0B] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tighter">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-lg">Got questions? We've got answers about our premium cloud services.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div 
                key={i}
                className={`rounded-2xl border transition-all duration-300 ${
                  openFaq === i 
                    ? 'bg-white/[0.03] border-orange-500/30 shadow-[0_0_40px_rgba(234,88,12,0.1)]' 
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-6 px-8 flex items-center justify-between gap-4 text-left"
                >
                  <span className="text-lg font-bold text-white">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 border-orange-500/30' : ''}`}>
                    <ChevronDown className={`w-4 h-4 ${openFaq === i ? 'text-orange-500' : 'text-slate-500'}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 text-slate-400 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-40 relative overflow-hidden bg-[#0A0A0B]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-600/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Ready to fire up <br /> your next project?</h2>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
              Join thousands of developers and businesses who trust <span className="text-orange-500 font-bold">jannatit.net</span> for their mission-critical infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href={links['order_now'] || '/vps'} 
                className="w-full sm:w-auto px-12 py-5 bg-[#FF4D00] text-white font-black rounded-2xl hover:bg-[#FF6A00] transition-all text-center uppercase tracking-widest text-xs shadow-2xl shadow-orange-600/20 hover:shadow-[#FF4D00]/40 hover:scale-[1.05] active:scale-95"
              >
                Get Started Now
              </a>
              <button 
                onClick={toggleChat}
                className="w-full sm:w-auto px-12 py-5 bg-white/5 text-white border border-white/10 font-black rounded-2xl hover:bg-white/10 transition-all text-center uppercase tracking-widest text-xs backdrop-blur-sm hover:border-white/30"
              >
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

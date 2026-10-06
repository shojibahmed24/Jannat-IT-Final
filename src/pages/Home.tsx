import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Zap, Globe, ChevronDown, Server, Code, Lock, ArrowRight, Check,
  Monitor, HardDrive, Clock, Star, Mail, CreditCard, MapPin, Cpu, RefreshCw, Sparkles, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';
import AnimatedSection from '../components/ui/AnimatedSection';
import MagneticButton from '../components/ui/MagneticButton';
import CountUp from '../components/ui/CountUp';
import PricingTabs from '../components/PricingTabs';

const FAQS = [
  { q: "What is the uptime guarantee?", a: "We guarantee 99.9% network and power uptime. If we fail to meet this, you are eligible for account credits under our SLA." },
  { q: "Do you provide DDoS protection?", a: "Yes, all plans include enterprise-grade L3/L4 DDoS mitigation to keep your services online during attacks." },
  { q: "Can I upgrade my plan later?", a: "Absolutely. You can scale your resources up or down at any time seamlessly through our client portal." },
  { q: "What payment methods do you accept?", a: "We accept MasterCard, Crypto, Wise, and Payoneer for maximum convenience." }
];

const TECH_STACK = ["Node.js", "Python", "Docker", "WordPress", "React", "Linux", "MySQL", "PHP", "Kubernetes", "Redis"];

const SERVICES = [
  { name: "VPS Hosting", desc: "High-performance virtual servers with full root access", price: "9.99", icon: Server, path: "/vps-hosting", color: "from-orange-500 to-red-500" },
  { name: "Windows RDP", desc: "Remote desktop with dedicated resources & GPU support", price: "14.99", icon: Monitor, path: "/rdp-servers", color: "from-blue-500 to-cyan-500" },
  { name: "Dedicated Servers", desc: "Bare-metal power for mission-critical workloads", price: "89.99", icon: HardDrive, path: "/dedicated-servers", color: "from-purple-500 to-pink-500" },
  { name: "Domain Names", desc: "Register & manage domains with free WHOIS privacy", price: "8.99", icon: Globe, path: "/domains", color: "from-emerald-500 to-teal-500" }
];

const TESTIMONIALS = [
  { name: "Ahmed R.", role: "CEO, TechStartup BD", quote: "Jannat IT's infrastructure has been rock solid. We migrated our entire SaaS platform and haven't had a single minute of downtime in 6 months.", rating: 5 },
  { name: "Sarah K.", role: "CTO, GameHost Pro", quote: "Their DDoS protection saved us during a massive attack. The team responded within minutes and our services stayed online throughout.", rating: 5 },
  { name: "David L.", role: "DevOps Lead, CloudApp", quote: "We migrated from a major cloud provider and now save 60% monthly. The NVMe performance is incredible — our database queries are 3x faster.", rating: 5 }
];

const LOCATIONS = [
  { city: "New York", country: "USA", ping: "<10ms", flag: "🇺🇸" },
  { city: "Amsterdam", country: "Netherlands", ping: "<15ms", flag: "🇳🇱" },
  { city: "Singapore", country: "Asia-Pacific", ping: "<20ms", flag: "🇸🇬" }
];

export default function Home() {
  const [testimonials, setTestimonials] = React.useState<any[]>(TESTIMONIALS);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const res = await fetch(`${wpData.apiUrl}jannat-it/v1/testimonials`);
          const data = await res.json();
          if (data && data.length > 0) setTestimonials(data);
        } catch (err) {
          console.error('Failed to fetch testimonials:', err);
        }
      }
    };
    fetchTestimonials();
  }, []);
  const { settings, links } = useApp();
  useSEO({ title: 'Jannat IT - Enterprise Cloud Infrastructure', description: 'High-performance cloud computing with 99.9% uptime guarantee.' });

  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const [dynamicFaqs, setDynamicFaqs] = React.useState(FAQS);
  const [pageData, setPageData] = React.useState<any>(null);
  const [email, setEmail] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      const wpData = (window as any).wpData;
      if (wpData?.apiUrl) {
        try {
          const [faqRes, pageRes] = await Promise.all([
            fetch(`${wpData.apiUrl}jannat-it/v1/faqs`),
            fetch(`${wpData.apiUrl}jannat-it/v1/page/home`)
          ]);
          const faqData = await faqRes.json();
          if (faqData?.length > 0) setDynamicFaqs(faqData);
          const pd = await pageRes.json();
          if (pd && !pd.error) setPageData(pd);
        } catch {}
      }
    };
    fetchData();
  }, []);

  const toggleChat = () => { if ((window as any).Tawk_API) (window as any).Tawk_API.toggle(); };

  return (
    <div className="pt-2 pb-20 md:pt-24 md:pb-24 relative z-10 bg-[#0A0A0B] overflow-clip min-h-screen">
      
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-[900px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-orange-600/8 blur-[150px] rounded-full animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-red-600/8 blur-[120px] rounded-full animate-[float_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">

        {/* ══════════════════════════════════════════════
            1. HERO — Left text + Right floating dashboard
        ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-4 sm:pt-8 lg:pt-12 mb-16 md:mb-28">
          
          <AnimatedSection className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs sm:text-sm font-bold mb-6 sm:mb-8 mx-auto lg:mx-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Next-Gen Cloud Infrastructure
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-5 sm:mb-6 tracking-tight leading-[1.08]">
              <span className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">Deploy Your</span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Cloud Infrastructure</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-slate-400 mb-8 sm:mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {pageData?.acf?.hero_subtitle || "Enterprise-grade servers with 99.9% uptime, NVMe storage, and instant deployment. Scale from startup to enterprise."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center lg:justify-start">
              <a href="#pricing" className="group relative w-full sm:w-auto px-7 sm:px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl sm:rounded-xl font-bold transition-all hover:-translate-y-1 shadow-[0_0_30px_rgba(249,115,22,0.3)] text-center flex items-center justify-center gap-2 text-base overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">Get Started Free <ArrowRight className="w-5 h-5" /></span>
              </a>
              <Link to="/about" className="w-full sm:w-auto px-7 sm:px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl sm:rounded-xl font-bold transition-all text-center text-base">
                View Our Network
              </Link>
            </div>

            {/* Mobile compact dashboard card */}
            <div className="lg:hidden mt-8 bg-[#111]/90 border border-white/10 rounded-2xl p-4 shadow-xl text-left">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-3 h-3 text-emerald-500" />
                  </div>
                  <span className="text-white text-xs font-bold">System Status</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Online</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">CPU</span><span className="text-orange-400 font-bold">23%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[23%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">RAM</span><span className="text-blue-400 font-bold">52%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[52%]" /></div>
                </div>
              </div>
            </div>

            {/* Mobile mini stats */}
            <div className="flex flex-wrap justify-center gap-2 lg:hidden mt-6">
              {[
                { icon: Zap, label: "99.9% Uptime", c: "text-orange-500" },
                { icon: Server, label: "10K+ Servers", c: "text-blue-500" },
                { icon: Globe, label: "5+ Locations", c: "text-emerald-500" }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                  <s.icon className={`w-3 h-3 ${s.c}`} />
                  <span className="text-[11px] font-bold text-slate-300">{s.label}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* ★ FLOATING DASHBOARD — replaces terminal ★ */}
          <AnimatedSection delay={0.2} className="relative hidden lg:block">
            <div className="relative w-full h-[420px]">
              
              {/* Main dashboard card */}
              <motion.div 
                animate={{ y: [0, -8, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[380px] bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(249,115,22,0.08)]"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Server className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">Server Dashboard</p>
                      <p className="text-emerald-400 text-[10px] font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> All Systems Online</p>
                    </div>
                  </div>
                  <Activity className="w-4 h-4 text-slate-500" />
                </div>

                {/* CPU Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">CPU Usage</span>
                    <span className="text-orange-400 font-bold">23%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "23%" }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* RAM Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Memory</span>
                    <span className="text-blue-400 font-bold">4.2 / 8 GB</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "52%" }}
                      transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Storage Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">NVMe Storage</span>
                    <span className="text-purple-400 font-bold">38 / 100 GB</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "38%" }}
                      transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Network stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 font-medium mb-1">Network In</p>
                    <p className="text-white font-black text-sm">↓ 245 Mbps</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 font-medium mb-1">Network Out</p>
                    <p className="text-white font-black text-sm">↑ 128 Mbps</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating uptime card */}
              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-4 left-0 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">99.99% Uptime</p>
                  <p className="text-slate-500 text-xs">Last 30 days</p>
                </div>
                <div className="ml-2 flex gap-[2px] items-end h-6">
                  {[95,100,100,98,100,100,100,97,100,100].map((v, i) => (
                    <div key={i} className="w-1 bg-emerald-500 rounded-full" style={{ height: `${v * 0.24}px` }} />
                  ))}
                </div>
              </motion.div>

              {/* Floating NVMe badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-8 left-4 bg-[#111]/90 backdrop-blur-xl border border-orange-500/20 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-white font-bold text-xs">NVMe Powered</p>
                  <p className="text-orange-400 text-[10px] font-bold">10x Faster I/O</p>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>

        {/* Hero Stats — below hero on all screens */}
        <AnimatedSection delay={0.3} className="mb-16 md:mb-28">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: 10000, suffix: "+", label: "Servers Deployed", icon: Server, color: "text-orange-500 bg-orange-500/10" },
              { value: 99.9, suffix: "%", label: "Uptime SLA", icon: Zap, decimals: 1, color: "text-emerald-500 bg-emerald-500/10" },
              { value: 5, suffix: "+", label: "Global Locations", icon: MapPin, color: "text-blue-500 bg-blue-500/10" },
              { value: 24, suffix: "/7", label: "Expert Support", icon: Clock, color: "text-purple-500 bg-purple-500/10" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-white/10 transition-colors">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  <CountUp end={stat.value} decimals={stat.decimals || 0} />{stat.suffix}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* ══════════════════════════════════════════════
            2. SERVICE CARDS
        ══════════════════════════════════════════════ */}
        <AnimatedSection className="mb-16 md:mb-28">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-3 sm:mb-4">Our Services</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">Everything you need to build and scale.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {SERVICES.map((s, i) => (
              <Link key={i} to={s.path} className="group relative bg-[#111] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-7 hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden">
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color} opacity-50 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 sm:mb-5 shadow-lg`}>
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-sm sm:text-xl font-bold text-white mb-1 sm:mb-2">{s.name}</h3>
                <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-6 flex-1 hidden sm:block">{s.desc}</p>
                <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-0">
                  <div>
                    <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold tracking-wider">Starting at</span>
                    <div className="text-lg sm:text-3xl font-black text-white">${s.price}<span className="text-[10px] sm:text-sm text-slate-500 font-medium">/{s.path === '/domains' ? 'yr' : 'mo'}</span></div>
                  </div>
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AnimatedSection>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent mb-16 md:mb-28" />

        {/* ══════════════════════════════════════════════
            6. PRICING
        ══════════════════════════════════════════════ */}
        <div className="mb-16 md:mb-28" id="pricing">
          <PricingTabs />
        </div>

        {/* ══════════════════════════════════════════════
            3. TECH MARQUEE
        ══════════════════════════════════════════════ */}
        <AnimatedSection className="mb-16 md:mb-28">
          <p className="text-center text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 sm:mb-8">Trusted by developers worldwide</p>
          <div className="w-full relative overflow-hidden flex items-center py-4">
            <div className="absolute inset-y-0 left-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-[#0A0A0B] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-8 sm:w-20 md:w-32 bg-gradient-to-l from-[#0A0A0B] to-transparent z-10" />
            <div className="flex animate-scrolling-tech whitespace-nowrap">
              {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
                <div key={i} className="inline-flex items-center gap-2 px-4 sm:px-8 py-2 sm:py-3 bg-[#111] border border-white/5 rounded-full mx-2 sm:mx-4 text-slate-400 text-xs sm:text-base">
                  <Code className="w-3 h-3 sm:w-4 sm:h-4" /><span className="font-bold">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent mb-16 md:mb-28" />

        {/* ══════════════════════════════════════════════
            4. WHY CHOOSE US
        ══════════════════════════════════════════════ */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-3 sm:mb-4">Why Choose Jannat IT?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">Enterprise features included with every plan.</p>
        </div>
        <AnimatedSection className="mb-16 md:mb-28">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {[
              { icon: Cpu, title: "AMD EPYC™ Hardware", desc: "Latest generation processors with NVMe storage for maximum IOPS.", color: "text-orange-500 bg-orange-500/10" },
              { icon: Shield, title: "DDoS Protection", desc: "Enterprise-grade L3/L4 mitigation keeps services online.", color: "text-emerald-500 bg-emerald-500/10" },
              { icon: Globe, title: "Global Network", desc: "Multiple Tier-1 upstreams for ultra-low latency.", color: "text-blue-500 bg-blue-500/10" },
              { icon: Lock, title: "Full Root Access", desc: "Complete control. Install any OS or software.", color: "text-purple-500 bg-purple-500/10" },
              { icon: Clock, title: "Instant Deploy", desc: "Server ready in under 60 seconds.", color: "text-amber-500 bg-amber-500/10" },
              { icon: RefreshCw, title: "Auto Backups", desc: "Daily automated backups with one-click restore.", color: "text-cyan-500 bg-cyan-500/10" }
            ].map((f, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-4 sm:p-7 flex flex-col justify-center items-center lg:items-start lg:text-left text-center hover:border-white/10 transition-all">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-white mb-0 lg:mb-1.5 leading-tight">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed hidden lg:block">{f.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* ══════════════════════════════════════════════
            5. GLOBAL NETWORK
        ══════════════════════════════════════════════ */}
        <AnimatedSection className="mb-16 md:mb-28">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-3 sm:mb-4">Global Network</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {LOCATIONS.map((loc, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-4 sm:p-6 flex items-center gap-4 hover:border-white/10 transition-colors">
                <span className="text-3xl sm:text-4xl">{loc.flag}</span>
                <div className="flex-1"><h4 className="text-white font-bold text-sm sm:text-base leading-tight">{loc.city}</h4><p className="text-slate-500 text-[10px] sm:text-xs">{loc.country}</p></div>
                <div className="ml-auto text-right"><span className="text-emerald-400 font-black text-base sm:text-xl">{loc.ping}</span><p className="text-slate-500 text-[10px] sm:text-xs">latency</p></div>
              </div>
            ))}
          </div>
        </AnimatedSection>


        {/* ══════════════════════════════════════════════
            7. TESTIMONIALS
        ══════════════════════════════════════════════ */}
        <AnimatedSection className="mb-16 md:mb-28">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-3 sm:mb-4">Trusted by Developers</h2>
          </div>
          <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory sm:snap-none sm:grid sm:grid-cols-3 sm:overflow-visible scrollbar-hide">
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-[280px] sm:min-w-0 snap-center bg-[#111] border border-white/5 rounded-2xl p-5 sm:p-7 hover:border-white/10 transition-colors flex flex-col relative overflow-hidden">
                <div className="absolute top-2 right-4 text-7xl font-serif text-orange-500/[0.05] leading-none pointer-events-none select-none">"</div>
                <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, j) => (<Star key={j} className="w-4 h-4 text-orange-500 fill-orange-500" />))}</div>
                <p className="text-slate-300 text-sm sm:text-base mb-5 flex-1 leading-relaxed relative z-10">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-sm">{t.name.charAt(0)}</div>
                  <div><p className="text-white font-bold text-sm">{t.name}</p><p className="text-slate-500 text-xs">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* ══════════════════════════════════════════════
            8. FAQ
        ══════════════════════════════════════════════ */}
        <AnimatedSection className="max-w-4xl mx-auto mb-16 md:mb-28">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent text-center mb-6 sm:mb-10">Got Questions?</h2>
          <div className="space-y-3">
            {dynamicFaqs.map((faq, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-xl sm:rounded-2xl overflow-hidden">
                <button className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-bold text-sm sm:text-base text-white pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180 text-orange-500' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-slate-400 border-t border-white/5 pt-3 sm:pt-4 text-sm">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* ══════════════════════════════════════════════
            9. TRUST BADGES
        ══════════════════════════════════════════════ */}
        <AnimatedSection className="mb-16 md:mb-28">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: CreditCard, label: "Wise & Payoneer", sub: "International" },
              { icon: CreditCard, label: "MasterCard & Crypto", sub: "Global Payments" },
              { icon: Lock, label: "SSL Secured", sub: "256-bit Encryption" },
              { icon: Shield, label: "DDoS Protected", sub: "Enterprise Grade" }
            ].map((b, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0"><b.icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" /></div>
                <div><p className="text-white font-bold text-xs sm:text-sm">{b.label}</p><p className="text-slate-500 text-[10px] sm:text-xs">{b.sub}</p></div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* ══════════════════════════════════════════════
            10. CTA
        ══════════════════════════════════════════════ */}
        <AnimatedSection className="mb-8 md:mb-16">
          <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 p-6 sm:p-12 md:p-20 text-center">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 relative z-10">Ready to scale?</h2>
            <p className="text-sm sm:text-lg text-orange-100 max-w-2xl mx-auto mb-6 sm:mb-10 relative z-10">Join thousands of developers who trust Jannat IT.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 relative z-10">
              <a href="#pricing" className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-orange-600 hover:bg-orange-50 font-black rounded-xl transition-colors text-sm sm:text-base">Get Started Now</a>
              <button onClick={toggleChat} className="px-6 sm:px-8 py-3 sm:py-4 bg-black/20 hover:bg-black/30 text-white font-bold rounded-xl transition-colors text-sm sm:text-base">Contact Sales</button>
            </div>
          </div>
        </AnimatedSection>

        {/* ══════════════════════════════════════════════
            11. NEWSLETTER
        ══════════════════════════════════════════════ */}
        <AnimatedSection className="mb-0 md:mb-12">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-5 sm:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 md:flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0"><Mail className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" /></div>
              <div><h3 className="text-white font-bold text-sm sm:text-lg">Stay Updated</h3><p className="text-slate-500 text-xs sm:text-sm">Get the latest offers delivered to your inbox.</p></div>
            </div>
            <div className="flex w-full md:w-auto gap-2 sm:gap-3">
              <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 md:w-64 h-10 sm:h-12 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 sm:px-4 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600" />
              <button className="h-10 sm:h-12 px-4 sm:px-6 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-colors text-xs sm:text-sm whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}

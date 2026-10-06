import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Globe, Heart, Shield, Server, Activity, Target } from 'lucide-react';
import CountUp from '../components/ui/CountUp';
import AnimatedSection from '../components/ui/AnimatedSection';
import { useApp } from '../context/AppContext';

const TIMELINE = [
  { year: '2018', title: 'The Beginning', desc: 'Started with a single server rack and a vision to make cloud hosting accessible.' },
  { year: '2020', title: 'Global Expansion', desc: 'Opened our first international data centers in Europe and Singapore.' },
  { year: '2023', title: 'Enterprise Network', desc: 'Upgraded to a 10Tbps global backbone with advanced DDoS mitigation.' },
  { year: '2026', title: 'Industry Leaders', desc: 'Recognized globally as a premier provider of high-performance cloud instances.' }
];

const CORE_VALUES = [
  {
    icon: <Heart className="w-8 h-8 text-orange-500" />,
    title: "Customer Obsessed",
    desc: "Your success is our success. We provide 24/7 expert support that actually solves your problems, not just reads from a script.",
    colSpan: "md:col-span-2"
  },
  {
    icon: <Shield className="w-8 h-8 text-emerald-500" />,
    title: "Uncompromising Security",
    desc: "Enterprise-grade protection is built into our core, not sold as an add-on.",
    colSpan: "md:col-span-1"
  },
  {
    icon: <Activity className="w-8 h-8 text-blue-500" />,
    title: "Extreme Performance",
    desc: "We exclusively use top-tier AMD EPYC processors and NVMe storage.",
    colSpan: "md:col-span-1"
  },
  {
    icon: <Target className="w-8 h-8 text-purple-500" />,
    title: "Transparent & Honest",
    desc: "No hidden fees, no confusing pricing tiers. What you see is exactly what you get, with straightforward billing every month.",
    colSpan: "md:col-span-2"
  }
];

export default function AboutUs() {
  const [pageData, setPageData] = useState<any>(null);
  
  useEffect(() => {
    const fetchPage = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const res = await fetch(`${wpData.apiUrl}jannat-it/v1/page/about`);
          const data = await res.json();
          if (data && !data.error) setPageData(data);
        } catch (err) {}
      }
    };
    fetchPage();
  }, []);

  // Fallback to mock data if API fails or is loading
  const stats = {
    users: pageData?.acf?.stats_active_users || '50000',
    datacenters: pageData?.acf?.stats_datacenters || '16',
    uptime: pageData?.acf?.stats_uptime || '99.99'
  };

  return (
    <div className="pt-24 sm:pt-32 pb-12 sm:pb-24 relative z-10 overflow-hidden bg-[#0A0A0B]">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* 1. Hero Section (Abstract Globe/Network) */}
        <AnimatedSection className="mb-16 md:mb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              {/* CSS Rotating Rings */}
              <div className="absolute inset-0 border-2 border-orange-500/30 rounded-full animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-2 border-2 border-red-500/30 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
              <div className="absolute inset-4 border border-white/10 rounded-full bg-[#111] flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                <Globe className="w-10 h-10 text-orange-500" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              Empowering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                Digital World
              </span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              We are a team of passionate engineers, developers, and cloud experts dedicated to providing rock-solid infrastructure for the modern web.
            </p>
          </div>
        </AnimatedSection>

        {/* 2. Floating Counter Metrics (Glassmorphism Cards) */}
        <AnimatedSection delay={0.2} className="mb-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-orange-500 rounded-b-full opacity-50 group-hover:opacity-100 transition-opacity" />
              <Users className="w-10 h-10 text-orange-500 mx-auto mb-6" />
              <h3 className="text-5xl font-black text-white mb-2">
                <CountUp end={parseInt(stats.users.replace(/\D/g, ''))} suffix="+" />
              </h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Active Users</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-red-500 rounded-b-full opacity-50 group-hover:opacity-100 transition-opacity" />
              <Server className="w-10 h-10 text-red-500 mx-auto mb-6" />
              <h3 className="text-5xl font-black text-white mb-2">
                <CountUp end={parseInt(stats.datacenters.replace(/\D/g, ''))} />
              </h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Global Datacenters</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-emerald-500 rounded-b-full opacity-50 group-hover:opacity-100 transition-opacity" />
              <Activity className="w-10 h-10 text-emerald-500 mx-auto mb-6" />
              <h3 className="text-5xl font-black text-white mb-2">
                <CountUp end={parseFloat(stats.uptime.replace(/[^\d.]/g, ''))} decimals={2} suffix="%" />
              </h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Uptime Guarantee</p>
            </div>
          </div>
        </AnimatedSection>

        {/* 3. Our Journey (Vertical Timeline) */}
        <div className="mb-40">
          <AnimatedSection className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Our Journey</h2>
            <p className="text-slate-400">Milestones that defined our path to excellence.</p>
          </AnimatedSection>

          <div className="relative max-w-4xl mx-auto px-2 sm:px-0">
            {/* Center Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500 via-red-500 to-transparent md:-translate-x-1/2 opacity-20" />
            
            {TIMELINE.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <AnimatedSection 
                  key={idx} 
                  delay={0.2 + (idx * 0.1)} 
                  className={`relative flex flex-col md:flex-row items-start ${isLeft ? 'md:justify-start' : 'md:justify-end'} mb-12 pl-16 md:pl-0 w-full`}
                >
                  {/* Glowing Node */}
                  <div className={`absolute top-5 md:top-0 left-[23px] md:left-auto ${isLeft ? 'md:left-1/2' : 'md:left-1/2'} w-5 h-5 rounded-full bg-orange-500 shadow-[0_0_20px_#f97316] md:-translate-x-1/2 z-10 ring-4 ring-[#0A0A0B]`} />
                  
                  <div className={`w-full md:w-[45%] ${isLeft ? 'md:text-right' : 'md:text-left'} bg-[#111] md:bg-transparent p-5 sm:p-6 md:p-0 rounded-2xl border border-white/5 md:border-none`}>
                    <div className="text-orange-500 font-black text-xl mb-2">{item.year}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>

        {/* 4. Core Values (Bento Grid) */}
        <AnimatedSection>
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Core Values</h2>
            <p className="text-slate-400">The principles that drive everything we do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_VALUES.map((val, idx) => (
              <div 
                key={idx} 
                className={`bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10 hover:bg-white/[0.04] transition-all duration-300 group ${val.colSpan}`}
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                  {val.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{val.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{val.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}

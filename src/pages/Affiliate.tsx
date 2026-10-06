import React from 'react';
import { motion } from 'motion/react';
import { DollarSign, Share2, TrendingUp, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

import { useState, useEffect } from 'react';

export default function Affiliate() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const res = await fetch(`${wpData.apiUrl}jannat-it/v1/page/affiliate`);
          const data = await res.json();
          if (data && !data.error) setPageData(data);
        } catch (err) {
          console.error('Failed to fetch affiliate page data:', err);
        }
      }
    };
    fetchPageData();
  }, []);
  return (
    <div className="pt-32 pb-24 relative z-10 bg-[#0A0A0B] min-h-screen">
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* Hero */}
        <AnimatedSection className="text-center max-w-4xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8">
            <DollarSign className="w-4 h-4" /> Partner Program
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Earn up to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">30%</span> <br />
            Recurring Commission
          </h1>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            {pageData?.acf?.hero_subtitle || 'Join the Jannat IT affiliate program and turn your traffic into passive income. Recommend enterprise-grade cloud hosting and get rewarded for every active signup.'}
          </p>
          <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 mx-auto">
            Become an Affiliate <ArrowRight className="w-5 h-5" />
          </button>
        </AnimatedSection>

        {/* Features */}
        <AnimatedSection delay={0.2} className="mb-16 md:mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <TrendingUp />, title: "High Conversions", desc: "Our premium plans and rock-solid reputation mean your referrals actually convert into sales." },
              { icon: <Share2 />, title: "90-Day Cookie", desc: "You get the credit even if your referred user takes up to 90 days to make their first purchase." },
              { icon: <DollarSign />, title: "Fast Payouts", desc: "Receive your earnings on time, every time. Minimum payout threshold is only $50." }
            ].map((feat, i) => (
              <div key={i} className="bg-[#111] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.02] transition-colors">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* How it works */}
        <AnimatedSection delay={0.3} className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-2xl sm:rounded-[3rem] p-6 sm:p-6 sm:p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            
            {[
              { step: "01", title: "Sign Up", desc: "Create your free affiliate account in 60 seconds." },
              { step: "02", title: "Share Link", desc: "Get your custom tracking link and banners." },
              { step: "03", title: "Earn Money", desc: "Get paid for every successful server deployment." }
            ].map((step, i) => (
              <div key={i} className="relative z-10">
                <div className="w-24 h-24 mx-auto bg-[#0A0A0B] border-2 border-emerald-500/30 rounded-full flex items-center justify-center text-3xl font-black text-emerald-500 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

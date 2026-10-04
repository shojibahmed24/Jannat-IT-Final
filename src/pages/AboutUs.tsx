import React from 'react';
import { motion } from 'motion/react';
import { Users, History, Award, Globe, Heart, Shield } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">Our Mission & Vision</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Since 2018, Jannat IT has been dedicated to providing lightning-fast, secure, and reliable hosting solutions for businesses of all sizes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Empowering the Future of Web</h2>
              <p className="text-slate-400 leading-relaxed">
                Jannat IT was founded with a simple goal: to make high-performance hosting accessible and affordable. We believe that every developer and business deserves enterprise-grade infrastructure without the enterprise-grade price tag.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-bold text-orange-500 mb-2">50k+</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-500 mb-2">120+</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Data Centers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-500 mb-2">99.9%</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Uptime Record</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Expert Support</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-3xl border border-white/10 flex items-center justify-center p-12">
              <Users className="w-full h-full text-orange-500/50" />
            </div>
            <div className="absolute -top-6 -right-6 p-6 bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-2xl">
              <Award className="w-8 h-8 text-orange-500 mb-2" />
              <div className="text-white font-bold">Award Winning</div>
              <div className="text-xs text-slate-500">Infrastructure 2025</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: Heart, title: "Customer Obsessed", desc: "We put our customers at the heart of everything we do, providing world-class support around the clock." },
            { icon: Shield, title: "Security First", desc: "Our infrastructure is built with security as a core principle, protecting your data with enterprise-grade tools." },
            { icon: Globe, title: "Global Thinking", desc: "We operate globally to ensure your services are close to your users, no matter where they are." }
          ].map((item, idx) => (
            <div key={idx} className="p-10 rounded-3xl bg-white/[0.02] border border-white/5">
              <item.icon className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-12 rounded-[3rem] bg-orange-600 relative overflow-hidden text-center">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">Want to join our team?</h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">We're always looking for passionate individuals who want to help us build the next generation of cloud infrastructure.</p>
            <button className="px-10 py-4 bg-white text-orange-600 font-bold rounded-2xl hover:bg-slate-100 transition-all">
              View Open Positions
            </button>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mt-32" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mb-32" />
        </div>
      </div>
    </div>
  );
}

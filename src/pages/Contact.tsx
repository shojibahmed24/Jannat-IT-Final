import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, MessageSquare, Phone, Send, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import { useTawkChat } from '../hooks/useTawkChat';
import { useApp } from '../context/AppContext';

export default function Contact() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', department: 'Sales Inquiry', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { settings } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) return;
    
    setStatus('loading');
    try {
      const wpData = (window as any).wpData;
      const apiUrl = wpData?.apiUrl ? `${wpData.apiUrl}jannat-it/v1/contact` : '/api/contact';
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', department: 'Sales Inquiry', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };
  const { openChat } = useTawkChat();

  return (
    <div className="pt-32 pb-24 relative z-10 bg-[#0A0A0B] min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-600/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Touch</span>
          </h1>
          <p className="text-xl text-slate-400">
            Have a question about our services? Our enterprise support team is available 24/7 to assist you.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl font-bold text-white mb-8">Contact Information</h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-6 bg-[#111] p-6 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Email Us</h3>
                  <p className="text-slate-400 mb-2">For general inquiries and support.</p>
                  <a href="mailto:support@jannatit.net" className="text-orange-400 hover:text-orange-300 font-medium">support@jannatit.net</a>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-[#111] p-6 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Live Chat</h3>
                  <p className="text-slate-400 mb-3">Get instant answers from our sales engineers.</p>
                  <button onClick={openChat} className="px-5 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg font-bold hover:bg-emerald-500/20 transition-colors">
                    Start Chat Now
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-[#111] p-6 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Office Address</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Dhaka, Bangladesh<br />
                    (Visits by appointment only for enterprise clients)
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection delay={0.2}>
            <div className="bg-[#111] border border-white/5 p-5 sm:p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />
              
              <h2 className="text-3xl font-bold text-white mb-8 relative z-10">Send a Message</h2>
              
              <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">First Name</label>
                    <input type="text" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="John" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Last Name</label>
                    <input type="text" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Email Address</label>
                  <input type="email" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Department</label>
                  <div className="relative">
                    <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none">
                    <option>Sales Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Abuse Report</option>
                  </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Message</label>
                  <textarea rows={4} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none" placeholder="How can we help you?" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2">
                  Send Message <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

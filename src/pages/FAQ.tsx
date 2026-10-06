import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import { useTawkChat } from '../hooks/useTawkChat';

const MOCK_FAQS = [
  {
    category: "General & Sales",
    questions: [
      { q: "How long does server deployment take?", a: "VPS and RDP instances are deployed automatically within 60 seconds of payment confirmation. Dedicated servers typically take 15 to 45 minutes depending on the hardware configuration and OS installation." },
      { q: "What payment methods do you accept?", a: "We accept all major Credit/Debit Cards, PayPal, and Cryptocurrency (BTC, ETH, USDT) via our secure checkout." },
      { q: "Do you offer a money-back guarantee?", a: "Yes, we offer a 7-day money-back guarantee for all VPS and RDP plans if you are not satisfied with the performance." }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      { q: "Do I get full root/admin access?", a: "Yes! All our VPS, RDP, and Dedicated Server plans come with full root (Linux) or Administrator (Windows) privileges." },
      { q: "Can I upgrade my server later?", a: "Absolutely. You can scale your VPS or RDP resources (CPU, RAM, Storage) at any time from your client dashboard without any data loss." },
      { q: "Is DDoS protection included?", a: "Yes, enterprise-grade L3/L4 DDoS mitigation is included free of charge across all our hosting plans." }
    ]
  }
];

export default function FAQ() {
  const { openChat } = useTawkChat();
  const [activeQ, setActiveQ] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<any[]>(MOCK_FAQS);

  useEffect(() => {
    const fetchFaqs = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const res = await fetch(`${wpData.apiUrl}jannat-it/v1/faqs`);
          const data = await res.json();
          if (data && data.length > 0) {
            // Reformat flat WP faqs into General category for simplicity
            setFaqs([{ category: "General", items: data }]);
          }
        } catch (err) {
          console.error('Failed to fetch FAQs:', err);
        }
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="pt-24 sm:pt-32 pb-12 sm:pb-24 relative z-10 bg-[#0A0A0B] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 relative">
        
        <AnimatedSection className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6">
            <HelpCircle className="w-4 h-4" /> Support Center
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-400">Everything you need to know about Jannat IT services and billing.</p>
        </AnimatedSection>

        <div className="space-y-12">
          {faqs.map((cat, catIdx) => (
            <AnimatedSection key={catIdx} delay={0.1 * catIdx}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-blue-500 rounded-full" />
                {cat.category}
              </h2>
              
              <div className="space-y-4">
                {cat.questions.map((faq, i) => {
                  const id = `${catIdx}-${i}`;
                  const isOpen = activeQ === id;
                  
                  return (
                    <div key={i} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden transition-colors hover:border-white/10">
                      <button 
                        className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                        onClick={() => setActiveQ(isOpen ? null : id)}
                      >
                        <span className="font-bold text-lg text-white pr-8">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4} className="mt-20 text-center bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 sm:p-10">
          <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-slate-400 mb-6">Our support team is available 24/7 to assist you.</p>
          <button onClick={openChat} className="px-8 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            Chat with Support
          </button>
        </AnimatedSection>

      </div>
    </div>
  );
}

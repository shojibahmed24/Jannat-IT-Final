import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, AlertTriangle } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

const LEGAL_TABS = [
  { id: 'tos', name: 'Terms of Service', icon: <FileText className="w-5 h-5" /> },
  { id: 'privacy', name: 'Privacy Policy', icon: <Shield className="w-5 h-5" /> },
  { id: 'aup', name: 'Acceptable Use', icon: <AlertTriangle className="w-5 h-5" /> }
];

export default function Legal() {
  const [activeTab, setActiveTab] = useState('tos');
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const res = await fetch(`${wpData.apiUrl}jannat-it/v1/page/legal`);
          const data = await res.json();
          if (data && !data.error) setPageData(data);
        } catch (err) {
          console.error('Failed to fetch legal page data:', err);
        }
      }
    };
    fetchPageData();
  }, []);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#privacy') setActiveTab('privacy');
    else if (location.hash === '#aup') setActiveTab('aup');
    else if (location.hash === '#tos') setActiveTab('tos');
  }, [location.hash]);

  return (
    <div className="pt-24 sm:pt-32 pb-12 sm:pb-24 relative z-10 bg-[#0A0A0B] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        <AnimatedSection className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Legal Agreements</h1>
          <p className="text-slate-400">Last updated: {pageData?.acf?.last_updated || 'October 2026'}</p>
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4 shrink-0">
            <div className="sticky top-32 flex flex-row overflow-x-auto gap-2 lg:flex-col lg:overflow-visible pb-2 lg:pb-0">
              {LEGAL_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 whitespace-nowrap lg:w-full flex items-center gap-3 px-5 py-3 lg:py-4 rounded-xl font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]' 
                      : 'bg-[#111] text-slate-400 hover:bg-white/5 hover:text-white border border-white/5'
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-[#111] border border-white/5 rounded-3xl p-5 sm:p-5 sm:p-8 md:p-12 min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="prose prose-invert prose-orange max-w-none"
                >
                  {activeTab === 'tos' && (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">Terms of Service</h2>
                      {pageData?.acf?.tos_content ? (
                          <div className="prose prose-invert prose-orange max-w-none" dangerouslySetInnerHTML={{ __html: pageData.acf.tos_content }} />
                        ) : (
                          <>
                            <p className="text-slate-400 leading-relaxed mb-4">
                              Welcome to Jannat IT. By accessing or using our infrastructure, you agree to be bound by these Terms of Service. Please read them carefully.
                            </p>
                            <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Account Provisioning</h3>
                            <p className="text-slate-400 leading-relaxed mb-4">
                              All services are provisioned immediately upon successful payment verification. In cases of fraud suspicion, provisioning may be delayed pending manual review.
                            </p>
                            <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Payment & Billing</h3>
                            <p className="text-slate-400 leading-relaxed mb-4">
                              Services are billed on a recurring cycle (monthly or annually). Failure to pay within 3 days of the due date will result in service suspension. Termination of data occurs after 14 days of non-payment.
                            </p>
                          </>
                        )}
                    </div>
                  )}

                  {activeTab === 'privacy' && (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">Privacy Policy</h2>
                      <p className="text-slate-400 leading-relaxed mb-4">
                        At Jannat IT, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
                      </p>
                      <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Data Collection</h3>
                      <p className="text-slate-400 leading-relaxed mb-4">
                        We only collect data necessary to provide our hosting services, process payments, and comply with international regulations. We do not sell your data to third parties.
                      </p>
                      <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Server Data Isolation</h3>
                      <p className="text-slate-400 leading-relaxed mb-4">
                        We have no access to the data stored on your VPS, RDP, or Dedicated Servers unless explicitly granted by you for technical support purposes. Your root passwords and encryption keys remain exclusively yours.
                      </p>
                    </div>
                  )}

                  {activeTab === 'aup' && (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">Acceptable Use Policy (AUP)</h2>
                      <p className="text-slate-400 leading-relaxed mb-4">
                        To maintain network integrity and ensure the best experience for all customers, the following activities are strictly prohibited on Jannat IT networks.
                      </p>
                      <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Prohibited Activities</h3>
                      <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>Hosting or distributing malware, phishing sites, or botnets.</li>
                        <li>Sending unsolicited bulk email (SPAM).</li>
                        <li>Conducting DDoS attacks or network abuse.</li>
                        <li>Hosting child exploitation material.</li>
                      </ul>
                      <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Enforcement</h3>
                      <p className="text-slate-400 leading-relaxed mb-4">
                        Violation of this AUP may result in immediate suspension or termination of services without a refund.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

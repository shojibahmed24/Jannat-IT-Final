import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Monitor, HardDrive, Globe, Check, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  specs: string[];
  popular: boolean;
  orderUrl?: string | null;
}

interface TabConfig {
  key: string;
  label: string;
  icon: React.ElementType;
  slug: string;
  pageLink: string;
  fallback: Plan[];
}

const TABS: TabConfig[] = [
  {
    key: 'vps', label: 'VPS Hosting', icon: Server, slug: 'vps', pageLink: '/vps-hosting',
    fallback: [
      { id: 'vps-1', name: 'Starter Cloud', price: 4.99, oldPrice: null, specs: ['1 vCPU Core', '2GB RAM', '40GB NVMe SSD', '1Gbps Network'], popular: false, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=2' },
      { id: 'vps-2', name: 'Professional', price: 9.99, oldPrice: null, specs: ['2 vCPU Cores', '4GB RAM', '80GB NVMe SSD', '2Gbps Network'], popular: false, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=2' },
      { id: 'vps-3', name: 'Business', price: 14.99, oldPrice: null, specs: ['4 vCPU Cores', '8GB RAM', '160GB NVMe SSD', '5Gbps Network'], popular: true, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=1' },
      { id: 'vps-4', name: 'Enterprise', price: 29.99, oldPrice: null, specs: ['8 vCPU Cores', '16GB RAM', '320GB NVMe SSD', '10Gbps Network'], popular: false, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=2' }
    ]
  },
  {
    key: 'rdp', label: 'Windows RDP', icon: Monitor, slug: 'rdp', pageLink: '/rdp-servers',
    fallback: [
      { id: 'rdp-1', name: 'User RDP', price: 6.99, oldPrice: null, specs: ['2 vCPU Cores', '4GB RAM', '50GB NVMe', '1Gbps Port', 'No Admin Access'], popular: false, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=2' },
      { id: 'rdp-2', name: 'Pro RDP', price: 9.99, oldPrice: null, specs: ['4 vCPU Cores', '8GB RAM', '100GB NVMe', '1Gbps Port', 'Full Admin Access'], popular: false, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=2' },
      { id: 'rdp-3', name: 'Admin RDP', price: 14.99, oldPrice: null, specs: ['6 vCPU Cores', '12GB RAM', '150GB NVMe', '2Gbps Port', 'Full Admin Access'], popular: true, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=1' },
      { id: 'rdp-4', name: 'Forex/Botting', price: 24.99, oldPrice: null, specs: ['8 vCPU Cores', '16GB RAM', '200GB NVMe', '5Gbps Port', 'Full Admin Access'], popular: false, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=2' }
    ]
  },
  {
    key: 'dedicated', label: 'Dedicated', icon: HardDrive, slug: 'dedicated', pageLink: '/dedicated-servers',
    fallback: [
      { id: 'power-e3', name: 'Power E3', price: 79.99, oldPrice: null, specs: ['Intel Xeon E3-1230', '4 Cores / 8 Threads', '32 GB RAM', '500 GB NVMe', '1Gbps Unmetered'], popular: false, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=2' },
      { id: 'advanced-epyc', name: 'Advanced Epyc', price: 119.99, oldPrice: null, specs: ['AMD EPYC 7232P', '8 Cores / 16 Threads', '64 GB RAM', '1 TB NVMe', '5Gbps Unmetered'], popular: false, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=2' },
      { id: 'elite-epyc', name: 'Elite Epyc', price: 169.99, oldPrice: null, specs: ['AMD EPYC 7313P', '16 Cores / 32 Threads', '128 GB RAM', '2x 1TB NVMe', '10Gbps Unmetered'], popular: true, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=1' },
      { id: 'titan-dual', name: 'Titan Dual', price: 299.99, oldPrice: null, specs: ['Dual Xeon Gold 6130', '32 Cores / 64 Threads', '256 GB RAM', '4x 2TB NVMe', '10Gbps Unmetered'], popular: false, orderUrl: 'https://my.jannatit.net/cart.php?a=add&pid=2' }
    ]
  },
  {
    key: 'domains', label: 'Domains', icon: Globe, slug: 'domains', pageLink: '/domains',
    fallback: [
      { id: 'dom-com', name: '.com', price: 9.99, oldPrice: 12.99, specs: ['Free WHOIS Privacy', 'DNS Management', 'Email Forwarding'], popular: true, orderUrl: null },
      { id: 'dom-net', name: '.net', price: 11.99, oldPrice: 13.99, specs: ['Free WHOIS Privacy', 'DNS Management', 'Email Forwarding'], popular: false, orderUrl: null },
      { id: 'dom-org', name: '.org', price: 12.99, oldPrice: 14.99, specs: ['Free WHOIS Privacy', 'DNS Management', 'Email Forwarding'], popular: false, orderUrl: null },
      { id: 'dom-io', name: '.io', price: 34.99, oldPrice: 39.99, specs: ['Free WHOIS Privacy', 'DNS Management', 'Email Forwarding'], popular: false, orderUrl: null }
    ]
  }
];

export default function PricingTabs() {
  const [activeTab, setActiveTab] = React.useState('vps');
  const [isYearly, setIsYearly] = React.useState(false);
  const [plansData, setPlansData] = React.useState<Record<string, Plan[]>>({});
  const [loading, setLoading] = React.useState<Record<string, boolean>>({});
  const [direction, setDirection] = React.useState(1);

  const activeConfig = TABS.find(t => t.key === activeTab)!;

  React.useEffect(() => {
    if (plansData[activeTab]) return;
    const wpData = (window as any).wpData;
    if (!wpData?.apiUrl) return;
    setLoading(prev => ({ ...prev, [activeTab]: true }));
    fetch(`${wpData.apiUrl}jannat-it/v1/plans/${activeConfig.slug}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setPlansData(prev => ({ ...prev, [activeTab]: data }));
      })
      .catch(() => {})
      .finally(() => setLoading(prev => ({ ...prev, [activeTab]: false })));
  }, [activeTab]);

  const currentPlans = plansData[activeTab] || activeConfig.fallback;
  const isLoading = loading[activeTab] && !plansData[activeTab];
  const isDomain = activeTab === 'domains';

  const getPrice = (price: number) => {
    if (isDomain) return price.toFixed(2);
    return isYearly ? (price * 12 * 0.8).toFixed(2) : price.toFixed(2);
  };

  const handleTabChange = (key: string) => {
    const ci = TABS.findIndex(t => t.key === activeTab);
    const ni = TABS.findIndex(t => t.key === key);
    setDirection(ni > ci ? 1 : -1);
    setActiveTab(key);

    // Smart Scroll UX: Bring user back to the top of the cards if they are scrolled far down
    setTimeout(() => {
      const anchor = document.getElementById('tab-content-start');
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        // Header height (56px) + Sticky tabs height (~74px) = ~130px. 
        // We add a little extra padding so the first card isn't glued to the tabs.
        const offset = window.innerWidth < 768 ? 140 : 200;
        
        // Only scroll if the cards have moved UP past the tabs
        if (rect.top < offset) {
          window.scrollTo({
            top: window.scrollY + rect.top - offset,
            behavior: 'smooth'
          });
        }
      }
    }, 100); // Small delay to allow framer-motion to mount the new grid
  };

  return (
    <div className="w-full">
      {/* Header & Toggle */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent mb-4 sm:mb-6">
          Transparent Pricing
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto">
          Simple, predictable pricing. No hidden fees. Cancel anytime.
        </p>

        {!isDomain && (
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <span className={`text-xs sm:text-sm font-bold transition-colors ${!isYearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-14 sm:w-16 h-7 sm:h-8 bg-[#111] border border-white/10 rounded-full relative transition-colors duration-300 focus:outline-none active:scale-95 flex items-center px-1"
            >
              <motion.div
                layout
                className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                animate={{ x: isYearly ? (window.innerWidth < 640 ? 28 : 32) : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${isYearly ? 'text-white' : 'text-slate-500'}`}>
              Yearly <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black">SAVE 20%</span>
            </span>
          </div>
        )}
      </div>

      {/* Modern Pill Tab Bar (Sticky on Mobile) */}
      <div className="flex justify-center mb-10 sm:mb-16 sticky top-[56px] z-[50] -mx-6 px-6 py-4 bg-[#0A0A0B]/90 backdrop-blur-xl md:static md:top-auto md:bg-transparent md:backdrop-blur-none md:p-0 md:mx-0 border-b border-white/5 md:border-none">
        <div className="relative grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-2 bg-[#0A0A0B] md:bg-[#0A0A0B] border border-white/10 md:border-white/5 rounded-2xl p-2 shadow-2xl md:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] w-full md:w-auto md:inline-flex mx-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`relative flex justify-center items-center gap-2 px-2 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-bold transition-all whitespace-normal text-center active:scale-95 w-full md:w-auto ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/10 border border-orange-500/25 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon className={`w-4 h-4 sm:w-4 sm:h-4 relative z-10 transition-colors ${isActive ? 'text-orange-500' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div id="tab-content-start" className="w-full h-px" />
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={activeTab}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full mx-auto px-4 sm:px-6"
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#111] border border-white/5 rounded-3xl p-6 sm:p-8 animate-pulse">
                  <div className="h-8 bg-white/5 rounded-lg w-1/2 mb-6" />
                  <div className="h-12 bg-white/5 rounded-lg w-3/4 mb-8" />
                  <div className="space-y-4 mb-8">
                    {[1, 2, 3, 4, 5].map(j => (
                      <div key={j} className="h-4 bg-white/5 rounded w-full" />
                    ))}
                  </div>
                  <div className="h-12 bg-white/5 rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${currentPlans.length === 4 ? 'lg:grid-cols-4 lg:px-0 max-w-[1400px]' : 'lg:grid-cols-3 max-w-6xl'} gap-4 sm:gap-6 items-stretch md:items-center mx-auto`}>
              {currentPlans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={`relative flex flex-col h-full rounded-3xl transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-b from-[#1a1208] to-[#0A0A0B] border border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.1)] md:-translate-y-4 md:hover:-translate-y-6'
                      : 'bg-[#111] border border-white/5 hover:border-white/10 hover:-translate-y-2'
                  }`}
                >
                  {/* Popular Glow Effect at Top */}
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_20px_rgba(249,115,22,0.8)]" />
                  )}

                  <div className="p-5 lg:p-6 xl:p-8 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {plan.popular && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider mb-4">
                            <Sparkles className="w-3 h-3" /> Recommended
                          </div>
                        )}
                        <h3 className="text-xl sm:text-2xl font-bold text-white">{plan.name}</h3>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${plan.popular ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20' : 'bg-white/5'}`}>
                        {plan.popular ? <Zap className="w-5 h-5 text-white" /> : <Server className="w-5 h-5 text-slate-400" />}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-white/5">
                      {plan.oldPrice && (
                        <div className="text-slate-500 line-through text-sm mb-1">${plan.oldPrice.toFixed(2)}</div>
                      )}
                      <div className="flex items-end gap-1">
                        <span className="text-slate-400 font-bold text-xl">$</span>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${plan.price}-${isYearly}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className={`text-3xl sm:text-4xl lg:text-3xl xl:text-5xl font-black tracking-tight leading-none ${plan.popular ? 'bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent' : 'text-white'}`}
                          >
                            {getPrice(plan.price)}
                          </motion.span>
                        </AnimatePresence>
                        <span className="text-slate-500 font-medium mb-1">/{isDomain ? 'yr' : isYearly ? 'yr' : 'mo'}</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4 flex-1 mb-8">
                      {plan.specs.map((spec, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm">
                          <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-orange-500/10' : 'bg-white/5'}`}>
                            <Check className={`w-3 h-3 ${plan.popular ? 'text-orange-500' : 'text-slate-400'}`} />
                          </div>
                          <span className="text-slate-300 leading-tight pt-0.5">{spec}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <a
                      href={plan.orderUrl || 'https://billing.jannatit.com/cart.php'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full py-3.5 sm:py-4 rounded-xl text-center font-bold text-sm sm:text-base transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-[0_5px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] hover:-translate-y-1'
                          : 'bg-white/5 hover:bg-white/10 text-white hover:-translate-y-1'
                      }`}
                    >
                      {isDomain ? 'Register Domain' : 'Deploy Server'}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* View all link */}
      <div className="text-center mt-10 sm:mt-12">
        <Link
          to={activeConfig.pageLink}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 font-bold text-sm transition-colors active:scale-95 group"
        >
          Compare all {activeConfig.label} plans 
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

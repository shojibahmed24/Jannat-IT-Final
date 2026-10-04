import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  Server, 
  Globe, 
  Clock, 
  Monitor, 
  ShieldCheck, 
  Check, 
  Zap,
  CreditCard,
  ArrowRight
} from 'lucide-react';

const OS_OPTIONS = [
  { id: 'win22', name: 'Windows Server 2022', icon: Monitor, price: 0 },
  { id: 'win19', name: 'Windows Server 2019', icon: Monitor, price: 0 },
  { id: 'ub22', name: 'Ubuntu 22.04 LTS', icon: Zap, price: 0 },
  { id: 'deb11', name: 'Debian 11', icon: Zap, price: 0 },
  { id: 'cen7', name: 'CentOS 7', icon: Zap, price: 0 },
];

const LOCATIONS = [
  { id: 'us-east', name: 'New York, USA', flag: '🇺🇸', lat: '1.2ms' },
  { id: 'us-west', name: 'Los Angeles, USA', flag: '🇺🇸', lat: '1.5ms' },
  { id: 'uk-lon', name: 'London, UK', flag: '🇬🇧', lat: '0.8ms' },
  { id: 'nl-ams', name: 'Amsterdam, NL', flag: '🇳🇱', lat: '0.9ms' },
  { id: 'sg-sin', name: 'Singapore, SG', flag: '🇸🇬', lat: '2.1ms' },
];

const BILLING_CYCLES = [
  { id: 'monthly', name: 'Monthly', factor: 1, discount: 0 },
  { id: 'quarterly', name: 'Quarterly', factor: 3, discount: 5 },
  { id: 'annually', name: 'Annually', factor: 12, discount: 15 },
];

const PLAN_DATA: Record<string, any> = {
  'standard-vps': { name: 'Standard VPS', price: 4.99, type: 'VPS' },
  'premium-rdp': { name: 'Premium RDP', price: 16.20, type: 'RDP' },
  'dedicated-server': { name: 'Dedicated Server', price: 79.99, type: 'Dedicated' },
  'starter-vps': { name: 'Starter VPS', price: 4.99, type: 'VPS' },
  'business-vps': { name: 'Business VPS', price: 12.99, type: 'VPS' },
  'enterprise-vps': { name: 'Enterprise VPS', price: 24.99, type: 'VPS' },
  '4gb-rdp': { name: '4GB RDP', price: 16.20, type: 'RDP' },
  '8gb-rdp': { name: '8GB RDP', price: 29.99, type: 'RDP' },
  '16gb-rdp': { name: '16GB RDP', price: 47.99, type: 'RDP' },
  'power-e3': { name: 'Power E3 Dedicated', price: 79.99, type: 'Dedicated' },
  'elite-epyc': { name: 'Elite Epyc Dedicated', price: 149.99, type: 'Dedicated' },
  'titan-dual': { name: 'Titan Dual Xeon', price: 299.99, type: 'Dedicated' },
};

// --- WHMCS CONFIGURATION ---
/**
 * HOW TO AUTOMATE PROVISIONING:
 * 1. In your WHMCS, create a Hook (AfterPaymentPaid).
 * 2. The Hook should send a POST request to: {YOUR_APP_URL}/api/whmcs/provision
 * 3. Payload example:
 *    {
 *      "secret": "WHMCS_FIREVPS_SECRET_2026",
 *      "email": "user@example.com",
 *      "planName": "Business VPS",
 *      "planType": "VPS",
 *      "location": "USA"
 *    }
 */
const WHMCS_CONFIG = {
  baseUrl: 'https://billing.yourdomain.com', // Your WHMCS installation URL
  productIds: {
    'standard-vps': '1', // The ID of this product in WHMCS
    'premium-rdp': '2',
    'dedicated-server': '3',
    'starter-vps': '4',
    'business-vps': '5',
    'enterprise-vps': '6',
    '4gb-rdp': '7',
    '8gb-rdp': '8',
    '16gb-rdp': '9',
    'power-e3': '10',
    'elite-epyc': '11',
    'titan-dual': '12',
  }
};

export default function ConfigurePlan() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { createWHMCSOrder, settings } = useApp();
  const [selectedOS, setSelectedOS] = useState(OS_OPTIONS[0]);
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[0]);
  const [selectedCycle, setSelectedCycle] = useState(BILLING_CYCLES[0]);
  const [step, setStep] = useState(1); // 1: Configure, 2: Checkout
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whmcsBaseUrl = settings?.whmcsUrl || WHMCS_CONFIG.baseUrl;
  
  const plan = PLAN_DATA[planId || 'standard-vps'] || PLAN_DATA['standard-vps'];
  
  const vpsMarkup = settings?.vpsMarkup || 0;
  const basePrice = plan.price * (1 + vpsMarkup / 100);
  const cyclePrice = basePrice * selectedCycle.factor;
  const discountAmount = (cyclePrice * selectedCycle.discount) / 100;
  const totalPrice = cyclePrice - discountAmount;

  const handleCheckout = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      setIsRedirecting(true);
      setError(null);
      
      try {
        // Check if manual redirect is enabled
        if (settings?.checkoutMode === 'manual') {
          if (settings.manualRedirectUrl) {
            window.location.href = settings.manualRedirectUrl;
            return;
          } else {
            throw new Error('Manual redirect URL is not configured in Admin Panel.');
          }
        }

        // WHMCS API Mode
        const whmcsPid = WHMCS_CONFIG.productIds[planId as keyof typeof WHMCS_CONFIG.productIds] || '1';
        const billingCycle = selectedCycle.id; // e.g., 'monthly', 'annually'
        
        const response = await createWHMCSOrder(whmcsPid, billingCycle);
        
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
        } else {
          throw new Error('Could not generate payment link');
        }
      } catch (err: any) {
        console.error('Checkout error:', err);
        let msg = err.message || 'Something went wrong. Please try again.';
        if (msg.includes('not yet configured')) {
          msg = 'WHMCS Billing is not yet configured. Please set your WHMCS URLs in Admin > Billing.';
        }
        setError(msg);
        setIsRedirecting(false);
      }
    }
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto border border-orange-500/20 animate-pulse">
              <CreditCard className="w-10 h-10 text-orange-500" />
            </div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Redirecting to Secure Payment</h2>
            <p className="text-slate-500">Connecting to our WHMCS Billing Gateway...</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            DO NOT CLOSE THIS WINDOW
          </div>
          <div className="flex justify-center gap-4 opacity-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={() => step === 2 ? setStep(1) : navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to {step === 1 ? 'Plans' : 'Configuration'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Config Area */}
          <div className="lg:col-span-2 space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  <header>
                    <h1 className="text-3xl font-bold text-white mb-2">Configure Your Server</h1>
                    <p className="text-slate-500">Customize your {plan.name} to match your requirements.</p>
                  </header>

                  {/* OS Selection */}
                  <section>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-orange-500" />
                      1. Select Operating System
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {OS_OPTIONS.map((os) => (
                        <button
                          key={os.id}
                          onClick={() => setSelectedOS(os)}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                            selectedOS.id === os.id 
                            ? 'border-orange-500 bg-orange-600/10' 
                            : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <os.icon className={`w-5 h-5 ${selectedOS.id === os.id ? 'text-orange-500' : 'text-slate-500'}`} />
                            <span className="text-sm font-medium text-white">{os.name}</span>
                          </div>
                          {selectedOS.id === os.id && <Check className="w-4 h-4 text-orange-500" />}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Location Selection */}
                  <section>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-orange-500" />
                      2. Choose Server Location
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {LOCATIONS.map((loc) => (
                        <button
                          key={loc.id}
                          onClick={() => setSelectedLoc(loc)}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                            selectedLoc.id === loc.id 
                            ? 'border-orange-500 bg-orange-600/10' 
                            : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{loc.flag}</span>
                            <div className="text-left">
                              <div className="text-sm font-medium text-white">{loc.name}</div>
                              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Latency: {loc.lat}</div>
                            </div>
                          </div>
                          {selectedLoc.id === loc.id && <Check className="w-4 h-4 text-orange-500" />}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Billing Cycle */}
                  <section>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      3. Select Billing Cycle
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {BILLING_CYCLES.map((cycle) => (
                        <button
                          key={cycle.id}
                          onClick={() => setSelectedCycle(cycle)}
                          className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all ${
                            selectedCycle.id === cycle.id 
                            ? 'border-orange-500 bg-orange-600/10' 
                            : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                          }`}
                        >
                          <div className="text-sm font-bold text-white mb-1">{cycle.name}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                            {cycle.discount > 0 ? `Save ${cycle.discount}%` : 'Standard Price'}
                          </div>
                          {selectedCycle.id === cycle.id && <Check className="w-4 h-4 text-orange-500 mt-3" />}
                        </button>
                      ))}
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <header>
                    <h1 className="text-3xl font-bold text-white mb-2">Billing Integration</h1>
                    <p className="text-slate-500">Pay via our secure WHMCS billing portal.</p>
                  </header>

                  <section className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110" />
                    
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-orange-600 flex items-center justify-center shadow-2xl shadow-orange-600/20">
                          <CreditCard className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">WHMCS Secure Checkout</h3>
                          <p className="text-slate-500 text-sm mt-1">Directly integrated with Jannat IT Billing System.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Payment Method</div>
                          <div className="text-sm text-white font-medium">Automatic Selection (PayPal/Stripe/Crypto)</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Invoice Type</div>
                          <div className="text-sm text-white font-medium">One-time / Recurring Active</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-600/10 border border-blue-500/20">
                        <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-400 leading-relaxed">
                          By clicking the button below, you will be redirected to our <span className="text-white font-bold">WHMCS Billing Portal</span> to complete your payment securely. After successful payment, your server will be deployed instantly.
                        </div>
                      </div>

                      {error && (
                        <div className="p-4 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                          {error}
                        </div>
                      )}
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="p-8 rounded-2xl bg-[#0A0A0B] border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-3xl -mr-16 -mt-16" />
                
                <h2 className="text-xl font-bold text-white mb-6 relative z-10">Order Summary</h2>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-medium text-slate-300">{plan.name}</div>
                    <div className="text-sm font-bold text-white">${basePrice.toFixed(2)}</div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">OS</span>
                      <span className="text-white font-medium">{selectedOS.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Location</span>
                      <span className="text-white font-medium">{selectedLoc.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Billing Cycle</span>
                      <span className="text-white font-medium">{selectedCycle.name}</span>
                    </div>
                  </div>

                  {selectedCycle.discount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-500 font-bold">
                      <span>Discount ({selectedCycle.discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Due Now</div>
                      <div className="text-3xl font-bold text-white">${totalPrice.toFixed(2)}</div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    {step === 1 ? 'Proceed to Checkout' : 'Checkout via WHMCS'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-4">
                    <ShieldCheck className="w-3 h-3" />
                    Encrypted Secure Checkout
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white/[0.01] border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-500">
                  <Server className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  Your server will be <span className="text-white font-bold">instantly deployed</span> after payment verification.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

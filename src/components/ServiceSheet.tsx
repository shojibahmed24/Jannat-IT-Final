import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Monitor, HardDrive, Globe, ArrowRight, X, Rocket } from 'lucide-react';

interface ServiceSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICES = [
  { name: "VPS Hosting", desc: "Virtual private servers", price: "$9.99/mo", icon: Server, path: "/vps-hosting", color: "bg-orange-500/10 text-orange-500" },
  { name: "Windows RDP", desc: "Remote desktop servers", price: "$14.99/mo", icon: Monitor, path: "/rdp-servers", color: "bg-blue-500/10 text-blue-500" },
  { name: "Dedicated Servers", desc: "Bare-metal performance", price: "$89.99/mo", icon: HardDrive, path: "/dedicated-servers", color: "bg-purple-500/10 text-purple-500" },
  { name: "Domain Names", desc: "Register & manage", price: "$8.99/yr", icon: Globe, path: "/domains", color: "bg-emerald-500/10 text-emerald-500" },
];

export default function ServiceSheet({ isOpen, onClose }: ServiceSheetProps) {
  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/10 rounded-t-3xl z-[111] max-h-[80vh] overflow-hidden"
          >
            {/* Grab handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <h3 className="text-lg font-black text-white">Our Services</h3>
              <button onClick={onClose} className="p-2 rounded-xl bg-white/5 active:scale-90 transition-transform">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Service list */}
            <div className="px-4 pb-4 space-y-2">
              {SERVICES.map((service, i) => (
                <Link
                  key={i}
                  to={service.path}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl active:scale-[0.98] active:bg-white/[0.06] transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${service.color}`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm">{service.name}</h4>
                    <p className="text-slate-500 text-xs">{service.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-white font-bold text-sm">{service.price}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 ml-auto mt-0.5" />
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="px-4 pb-6">
              <a
                href="https://billing.jannatit.com/cart.php"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-2xl active:scale-[0.98] transition-all text-sm"
              >
                <Rocket className="w-4 h-4" />
                Deploy Server Now
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Server, BookOpen, User, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileBottomNavProps {
  onServicesOpen: () => void;
  clientLoginUrl?: string;
}

export default function MobileBottomNav({ onServicesOpen, clientLoginUrl }: MobileBottomNavProps) {
  const location = useLocation();
  const [visible, setVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 100) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'services', label: 'Services', icon: Server, path: null },
    { id: 'blog', label: 'Blog', icon: BookOpen, path: '/blog' },
    { id: 'account', label: 'Account', icon: User, path: clientLoginUrl || 'https://billing.jannatit.com/clientarea.php' },
  ];

  const isActive = (path: string | null) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isServicePage = ['/vps-hosting', '/rdp-servers', '/dedicated-servers', '/domains'].some(
    p => location.pathname.startsWith(p)
  );

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden"
    >
      {/* Gradient fade above bar */}
      <div className="h-6 bg-gradient-to-t from-[#0A0A0B] to-transparent pointer-events-none" />
      
      <div className="bg-[#0A0A0B]/95 backdrop-blur-2xl border-t border-white/5 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const active = tab.id === 'services' ? isServicePage : isActive(tab.path);
            
            if (tab.id === 'services') {
              return (
                <button
                  key={tab.id}
                  onClick={onServicesOpen}
                  className="flex flex-col items-center justify-center gap-0.5 w-16 h-14 active:scale-90 transition-transform"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                    active ? 'bg-orange-500/15' : ''
                  }`}>
                    <tab.icon className={`w-5 h-5 ${active ? 'text-orange-500' : 'text-slate-500'}`} />
                  </div>
                  <span className={`text-[10px] font-bold ${active ? 'text-orange-500' : 'text-slate-500'}`}>{tab.label}</span>
                </button>
              );
            }

            if (tab.id === 'account') {
              return (
                <a
                  key={tab.id}
                  href={tab.path!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-0.5 w-16 h-14 active:scale-90 transition-transform"
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
                    <tab.icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{tab.label}</span>
                </a>
              );
            }

            return (
              <Link
                key={tab.id}
                to={tab.path!}
                className="flex flex-col items-center justify-center gap-0.5 w-16 h-14 active:scale-90 transition-transform"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                  active ? 'bg-orange-500/15' : ''
                }`}>
                  <tab.icon className={`w-5 h-5 ${active ? 'text-orange-500' : 'text-slate-500'}`} />
                </div>
                <span className={`text-[10px] font-bold ${active ? 'text-orange-500' : 'text-slate-500'}`}>{tab.label}</span>
                {active && (
                  <motion.div layoutId="bottomNavDot" className="w-1 h-1 bg-orange-500 rounded-full -mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

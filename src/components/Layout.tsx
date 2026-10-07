import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Zap, 
  Menu, 
  X, 
  Shield, 
  ChevronRight,
  User, Bell, Server, Monitor, HardDrive, Globe, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useTawkChat } from '../hooks/useTawkChat';
import MobileBottomNav from './MobileBottomNav';
import ServiceSheet from './ServiceSheet';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { toggleChat } = useTawkChat();
  

  const [footerServices, setFooterServices] = useState<any[]>([
    { name: 'VPS Hosting', path: '/vps', url: '/vps' },
    { name: 'Windows RDP', path: '/rdp', url: '/rdp' },
    { name: 'Dedicated Servers', path: '/dedicated', url: '/dedicated' },
    { name: 'Domain Names', path: '/domains', url: '/domains' },
      { name: 'Blog', path: '/blog', url: '/blog' }
  ]);
  const [footerCompany, setFooterCompany] = useState<any[]>([
    { name: 'About Us', path: '/about', url: '/about' },
    { name: 'Blog & News', path: '/blog', url: '/blog' },
    { name: 'Affiliate Program', path: '/affiliate', url: '/affiliate' }
  ]);
  const [footerSupport, setFooterSupport] = useState<any[]>([
    { name: 'FAQ', path: '/faq', url: '/faq' },
    { name: 'Contact', path: '/contact', url: '/contact' }
  ]);
  const [footerLegal, setFooterLegal] = useState<any[]>([
    { name: 'Terms of Service', path: '/legal#tos', url: '/legal#tos' },
    { name: 'Privacy Policy', path: '/legal#privacy', url: '/legal#privacy' },
    { name: 'Acceptable Use', path: '/legal#aup', url: '/legal#aup' }
  ]);

  useEffect(() => {
    const fetchMenus = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const fetchMenu = async (location: string, setter: any) => {
            const res = await fetch(`${wpData.apiUrl}jannat-it/v1/menu/${location}`);
            const data = await res.json();
            if (data && data.length > 0) setter(data);
          };
          await Promise.all([
            fetchMenu('primary_menu', setNavLinks),
              fetchMenu('footer_services', setFooterServices),
            fetchMenu('footer_company', setFooterCompany),
            fetchMenu('footer_support', setFooterSupport),
            fetchMenu('footer_legal', setFooterLegal)
          ]);
        } catch (err) {
          console.error('Failed to fetch menus', err);
        }
      }
    };
    fetchMenus();
  }, []);

  const { user, links, settings } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServiceSheetOpen, setIsServiceSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    const renderMenuLink = (item: any, className: string) => {
    if (item.url && (item.url.startsWith('http') || item.url.startsWith('//'))) {
      return <a key={item.id || item.name} href={item.url} target="_blank" rel="noopener noreferrer" className={className}>{item.name}</a>;
    }
    return <Link key={item.id || item.name} to={item.path || item.url} className={className}>{item.name}</Link>;
  };

  return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [navLinks, setNavLinks] = useState<any[]>([
    { name: "VPS Hosting", path: "/vps" },
    { name: "RDP Servers", path: "/rdp" },
    { name: "Dedicated", path: "/dedicated" },
    { name: "Domains", path: "/domains" },
    { name: "About Us", path: "/about" },
  ]);

  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-orange-500/30">
      {/* ═══════════════════════════════════════════════
          FIXED HEADERS (Bulletproof implementation)
      ═══════════════════════════════════════════════ */}
      {!isDashboard && (
        <div className="fixed top-0 left-0 right-0 z-[60] w-full pointer-events-none flex flex-col">
          
          {/* PROMO BANNER (Collapses on scroll) */}
            {settings?.promoBanner?.active && (
              <div className={`pointer-events-auto bg-gradient-to-r from-[#FF4D00] to-[#FF6A00] text-center transition-all duration-500 overflow-hidden flex items-center justify-center ${
                isScrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-[120px] opacity-100 py-1.5 sm:py-2.5'
              }`}>
                <p className="text-white text-[10.5px] sm:text-xs md:text-sm font-bold flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 leading-tight">
                  <span role="img" aria-label="fire">🔥</span>
                  <span>{settings.promoBanner.text}</span>
                  {settings.promoBanner.linkText && (
                    <>
                      <span className="hidden sm:inline">—</span>
                      <a href={settings.promoBanner.linkUrl || '#'} className="underline underline-offset-2 hover:text-white/90">
                        {settings.promoBanner.linkText}
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}

          {/* HEADERS WRAPPER */}
          <div className="relative w-full pointer-events-none">
            
            {/* DESKTOP HEADER */}
            <div className={`absolute top-0 left-0 right-0 pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hidden lg:block ${
              isScrolled ? 'pt-4 px-4' : 'pt-6 px-6'
            }`}>
              <header className={`max-w-7xl mx-auto transition-all duration-500 overflow-hidden ${
                isScrolled 
                  ? 'bg-[#0A0A0B]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-16' 
                  : 'bg-transparent h-20 rounded-2xl'
              }`}>
                <div className="h-full px-6 md:px-8 flex items-center justify-between">
                  {/* Zone 1: Brand */}
                  <Link to="/" className="flex items-center gap-3 group">
                      {settings?.siteLogo ? (
                        <img src={settings.siteLogo} alt={settings?.siteTitle || 'Logo'} className="h-10 w-auto object-contain shrink-0" />
                      ) : (
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.4)] rounded-xl group-hover:scale-105 transition-transform duration-300">
                          <defs>
                            <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#f97316"/>
                              <stop offset="1" stopColor="#dc2626"/>
                            </linearGradient>
                          </defs>
                          <rect width="40" height="40" rx="12" fill="url(#logoGrad)"/>
                          <path d="M26.5 19.5c0-2.2-1.8-4-4-4h-.4a6.5 6.5 0 0 0-12.2 1.8 3 3 0 0 0 .9 5.7h11.7a4 4 0 0 0 4-3.5z" fill="white"/>
                          <path d="M15 24v5m4-5v5m4-5v5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                          <path d="M11 31h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                        </svg>
                      )}
                      <div className="flex flex-col leading-none ml-1">
                        <span className="text-[22px] font-black tracking-tight text-white">{settings?.siteTitle || 'Jannat IT'}</span>
                        {!settings?.siteLogo && <span className="text-[10px] font-bold tracking-[0.1em] text-slate-500 uppercase mt-0.5">Cloud Hosting</span>}
                      </div>
                    </Link>

                  {/* Zone 2: Navigation */}
                  <nav className="flex items-center gap-1">
                    {navLinks.map((link: any) => {
                      const isActive = location.pathname === link.path;
                      return link.path.startsWith('http') ? (
                        <a 
                          key={link.path} 
                          href={link.path}
                          className="relative px-4 py-2 rounded-full text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link 
                          key={link.path} 
                          to={link.path}
                          className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {link.name}
                          {isActive && (
                            <motion.div 
                              layoutId="activeNavIndicator"
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(234,88,12,0.8)]"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Zone 3: Actions */}
                  <div className="flex items-center gap-4">
                    <a 
                      href={links.clientLogin || 'https://billing.jannatit.com/clientarea.php'} 
                      className="px-5 py-2.5 text-sm font-bold text-white hover:text-orange-400 transition-colors"
                    >
                      Client Area
                    </a>
                    <a 
                      href={links.orderNow || 'https://billing.jannatit.com/cart.php?a=add&pid=1'} 
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold rounded-full shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Deploy Server
                    </a>
                  </div>
                </div>
              </header>
            </div>

            {/* MOBILE HEADER */}
            <div className={`absolute top-0 left-0 right-0 pointer-events-auto lg:hidden transition-all duration-300 ${
              isScrolled ? 'bg-[#0A0A0B]/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.05)]' : 'bg-transparent'
            }`}>
              <div className="flex items-center justify-between h-14 px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5">
                  {settings?.siteLogo ? (
                    <img src={settings.siteLogo} alt={settings?.siteTitle || 'Logo'} className="h-8 w-auto object-contain shrink-0" />
                  ) : (
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 shrink-0 rounded-lg shadow-[0_0_12px_rgba(249,115,22,0.3)]">
                      <defs>
                        <linearGradient id="logoGradMobileHeader" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#f97316"/>
                          <stop offset="1" stopColor="#dc2626"/>
                        </linearGradient>
                      </defs>
                      <rect width="40" height="40" rx="10" fill="url(#logoGradMobileHeader)"/>
                      <path d="M26.5 19.5c0-2.2-1.8-4-4-4h-.4a6.5 6.5 0 0 0-12.2 1.8 3 3 0 0 0 .9 5.7h11.7a4 4 0 0 0 4-3.5z" fill="white"/>
                      <path d="M15 24v5m4-5v5m4-5v5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                      <path d="M11 31h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                    </svg>
                  )}
                  <span className="text-lg font-black tracking-tight text-white">{settings?.siteTitle || 'Jannat IT'}</span>
                </Link>

                {/* Right actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleChat}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 active:scale-90 active:bg-white/5 transition-all"
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                  <button 
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                    onClick={() => { setIsMenuOpen(true); document.body.style.overflow = "hidden"; }}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Spacer to prevent content from hiding under fixed header */}
      {!isDashboard && (
        <div className="h-[90px] lg:h-[120px] w-full" aria-hidden="true" />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && !isDashboard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0A0A0B]/98 backdrop-blur-2xl lg:hidden flex flex-col"
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
              <Link to="/" className="flex items-center gap-2" onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ""; }}>
                  {settings?.siteLogo ? (
                    <img src={settings.siteLogo} alt={settings?.siteTitle || 'Logo'} className="h-8 w-auto object-contain shrink-0" />
                  ) : (
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 shrink-0 rounded-lg shadow-[0_0_12px_rgba(249,115,22,0.3)]">
                      <defs>
                        <linearGradient id="logoGradMobileMenu" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#f97316"/>
                          <stop offset="1" stopColor="#dc2626"/>
                        </linearGradient>
                      </defs>
                      <rect width="40" height="40" rx="10" fill="url(#logoGradMobileMenu)"/>
                      <path d="M26.5 19.5c0-2.2-1.8-4-4-4h-.4a6.5 6.5 0 0 0-12.2 1.8 3 3 0 0 0 .9 5.7h11.7a4 4 0 0 0 4-3.5z" fill="white"/>
                      <path d="M15 24v5m4-5v5m4-5v5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                      <path d="M11 31h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                    </svg>
                  )}
                  <span className="text-xl font-black tracking-tight text-white">{settings?.siteTitle || 'Jannat IT'}</span>
                </Link>
              <button 
                className="p-2 text-white hover:bg-white/5 rounded-xl transition-colors"
                onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ""; }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto pt-8 pb-32 px-5 scrollbar-hide">
              {/* Services Group */}
              <div className="mb-8">
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 pl-3">Services</div>
                <div className="flex flex-col gap-2">
                  {[
                    { name: "VPS Hosting", path: "/vps", icon: <Server className="w-5 h-5" /> },
                    { name: "Windows RDP", path: "/rdp", icon: <Monitor className="w-5 h-5" /> },
                    { name: "Dedicated Servers", path: "/dedicated", icon: <HardDrive className="w-5 h-5" /> },
                    { name: "Domain Names", path: "/domains", icon: <Globe className="w-5 h-5" /> },
                  ].map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link 
                        to={link.path} 
                        onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ""; }}
                        className="group flex items-center justify-between p-3.5 bg-[#111]/80 backdrop-blur-lg hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                            {link.icon}
                          </div>
                          <span className="text-sm font-bold text-white">
                            {link.name}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-orange-500 transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Company Group */}
              <div className="mb-6">
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 pl-3">Company</div>
                <div className="flex flex-col gap-2">
                  {[
                    { name: "About Us", path: "/about", icon: <User className="w-5 h-5" /> },
                    { name: "Help & FAQ", path: "/faq", icon: <HelpCircle className="w-5 h-5" /> },
                  ].map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (i * 0.05) }}
                    >
                      <Link 
                        to={link.path} 
                        onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ""; }}
                        className="group flex items-center justify-between p-3.5 bg-[#111]/80 backdrop-blur-lg hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            {link.icon}
                          </div>
                          <span className="text-sm font-bold text-white">
                            {link.name}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-3">
                <a 
                  href={links['client_login']}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ""; }}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-2xl text-center transition-all active:scale-[0.98]"
                >
                  Client Login
                </a>
                <a 
                  href={links['order_now']}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ""; }}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-black rounded-2xl text-center shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-[0.98]"
                >
                  Deploy Server Now
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {children}
      </main>

      {/* Footer */}
      {!isDashboard && (
        <footer className="pt-8 pb-28 lg:py-20 border-t border-white/5 bg-black relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-12 lg:mb-16">
              
              {/* Brand Column */}
              <div className="w-full lg:w-2/5">
                <div className="flex items-center gap-2 mb-6">
                    {settings?.siteLogo ? (
                      <img src={settings.siteLogo} alt={settings?.siteTitle || 'Logo'} className="h-8 w-auto object-contain shrink-0" />
                    ) : (
                      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 shrink-0 rounded-lg shadow-[0_0_12px_rgba(249,115,22,0.3)]">
                        <defs>
                          <linearGradient id="logoGradFooter" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#f97316"/>
                            <stop offset="1" stopColor="#dc2626"/>
                          </linearGradient>
                        </defs>
                        <rect width="40" height="40" rx="10" fill="url(#logoGradFooter)"/>
                        <path d="M26.5 19.5c0-2.2-1.8-4-4-4h-.4a6.5 6.5 0 0 0-12.2 1.8 3 3 0 0 0 .9 5.7h11.7a4 4 0 0 0 4-3.5z" fill="white"/>
                        <path d="M15 24v5m4-5v5m4-5v5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                        <path d="M11 31h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                      </svg>
                    )}
                    <span className="text-2xl font-black tracking-tight text-white">{settings?.siteTitle || 'Jannat IT'}</span>
                  </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 lg:max-w-sm">
                  Providing premium virtual private servers and RDP solutions since 2018. Built for speed, reliability, and security.
                </p>
                <div className="flex flex-wrap gap-3">
                  {links['twitter_url'] && (
                    <a href={links['twitter_url']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-orange-500/10 hover:text-orange-500 text-slate-400 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                  )}
                  {links['facebook_url'] && (
                    <a href={links['facebook_url']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-slate-400 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                    </a>
                  )}
                    {links['telegram_url'] && (
                      <a href={links['telegram_url']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-cyan-500/10 hover:text-cyan-500 text-slate-400 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                      </a>
                    )}
                    {links['whatsapp_url'] && (
                      <a href={links['whatsapp_url']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-400 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                      </a>
                    )}
                  {links['instagram_url'] && (
                    <a href={links['instagram_url']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-pink-500/10 hover:text-pink-500 text-slate-400 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  )}
                  {links['linkedin_url'] && (
                    <a href={links['linkedin_url']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-400 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  )}
                  {links['telegram_url'] && (
                    <a href={links['telegram_url']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-cyan-500/10 hover:text-cyan-500 text-slate-400 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                    </a>
                  )}
                </div>
              </div>
              
              {/* Links Block: 3 columns side-by-side on ALL screens */}
              <div className="w-full lg:w-3/5 grid grid-cols-3 gap-2 sm:gap-6">
                
                {/* Services */}
                <div>
                  <h4 className="text-white font-bold mb-4 lg:mb-6 text-[10px] sm:text-xs lg:text-sm uppercase tracking-widest opacity-80">Services</h4>
                  <ul className="space-y-3 lg:space-y-4 text-[11px] sm:text-xs lg:text-sm text-slate-500">
                    {footerServices.map((item: any, i: number) => (
                      <li key={i}>
                        {item.url && (item.url.startsWith('http') || item.url.startsWith('//')) ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors block py-1 leading-tight">{item.name}</a>
                        ) : (
                          <Link to={item.path || item.url} className="hover:text-orange-500 transition-colors block py-1 leading-tight">{item.name}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="text-white font-bold mb-4 lg:mb-6 text-[10px] sm:text-xs lg:text-sm uppercase tracking-widest opacity-80">Support</h4>
                  <ul className="space-y-3 lg:space-y-4 text-[11px] sm:text-xs lg:text-sm text-slate-500">
                    {footerSupport.map((item: any, i: number) => (
                      <li key={i}>
                        {item.url && (item.url.startsWith('http') || item.url.startsWith('//')) ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors block py-1 leading-tight">{item.name}</a>
                        ) : (
                          <Link to={item.path || item.url} className="hover:text-orange-500 transition-colors block py-1 leading-tight">{item.name}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="text-white font-bold mb-4 lg:mb-6 text-[10px] sm:text-xs lg:text-sm uppercase tracking-widest opacity-80">Legal</h4>
                  <ul className="space-y-3 lg:space-y-4 text-[11px] sm:text-xs lg:text-sm text-slate-500">
                    {footerLegal.map((item: any, i: number) => (
                      <li key={i}>
                        {item.url && (item.url.startsWith('http') || item.url.startsWith('//')) ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors block py-1 leading-tight">{item.name}</a>
                        ) : (
                          <Link to={item.path || item.url} className="hover:text-orange-500 transition-colors block py-1 leading-tight">{item.name}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-[11px] sm:text-xs text-slate-600">
              <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Jannat IT Solutions. All rights reserved.</p>
              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
                <span>Managed with Precision</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full hidden sm:block"></span>
                <span className="flex items-center gap-1.5 text-emerald-500/80"><Shield className="w-3.5 h-3.5" /> Secure Payment</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {!isDashboard && (
        <>
          <MobileBottomNav 
            onServicesOpen={() => setIsServiceSheetOpen(true)} 
            clientLoginUrl={links['client_login']} 
          />
          <ServiceSheet 
            isOpen={isServiceSheetOpen} 
            onClose={() => setIsServiceSheetOpen(false)} 
          />
        </>
      )}
    </div>
  );
}

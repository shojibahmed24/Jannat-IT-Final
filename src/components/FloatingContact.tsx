import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FloatingContact() {
  const { links } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // If both links are missing, don't show the widget
  if (!links['whatsapp_url'] && !links['telegram_url']) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute bottom-16 right-0 items-end mb-2 flex flex-col gap-3"
          >
            {links['whatsapp_url'] && (
              <a 
                href={links['whatsapp_url']} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-[#111]/90 backdrop-blur-xl border border-white/10 p-2 pl-4 rounded-full shadow-2xl hover:border-emerald-500/30 transition-all hover:-translate-y-1"
              >
                <span className="text-white font-bold text-sm whitespace-nowrap">Chat on WhatsApp</span>
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </div>
              </a>
            )}

            {links['telegram_url'] && (
              <a 
                href={links['telegram_url']} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-[#111]/90 backdrop-blur-xl border border-white/10 p-2 pl-4 rounded-full shadow-2xl hover:border-cyan-500/30 transition-all hover:-translate-y-1"
              >
                <span className="text-white font-bold text-sm whitespace-nowrap">Join Telegram</span>
                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                </div>
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}

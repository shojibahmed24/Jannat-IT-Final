import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import PageLoader from './components/PageLoader';

// Lazy-loaded page components — each becomes a separate JS chunk.
// Only the chunk for the current route is downloaded, cutting initial bundle size significantly.
const Home = lazy(() => import('./pages/Home'));
const VPSHosting = lazy(() => import('./pages/VPSHosting'));
const RDPServers = lazy(() => import('./pages/RDPServers'));
const DedicatedServers = lazy(() => import('./pages/DedicatedServers'));
const Domains = lazy(() => import('./pages/Domains'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Affiliate = lazy(() => import('./pages/Affiliate'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Legal = lazy(() => import('./pages/Legal'));


import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="w-full h-full"
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/vps" element={<VPSHosting />} />
            <Route path="/rdp" element={<RDPServers />} />
            <Route path="/dedicated" element={<DedicatedServers />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin-secret-2026" element={<AdminPanel />} />
            
            <Route path="/affiliate" element={<Affiliate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </AppProvider>
  );
}

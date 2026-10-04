import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import VPSHosting from './pages/VPSHosting';
import RDPServers from './pages/RDPServers';
import DedicatedServers from './pages/DedicatedServers';
import Domains from './pages/Domains';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ConfigurePlan from './pages/ConfigurePlan';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vps" element={<VPSHosting />} />
            <Route path="/rdp" element={<RDPServers />} />
            <Route path="/dedicated" element={<DedicatedServers />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/configure/:planId" element={<ConfigurePlan />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

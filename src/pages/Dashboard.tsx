import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, Service, Ticket, Invoice } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Server, 
  CreditCard, 
  Ticket as TicketIcon, 
  Bell, 
  Settings, 
  LogOut,
  Zap,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Plus,
  Monitor,
  HardDrive,
  Cpu,
  Lock,
  MessageSquare,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronLeft,
  Power,
  Globe,
  Shield,
  Activity as ActivityIcon,
  Mail,
  Smartphone,
  User,
  ChevronRight
} from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import axios from 'axios';
import TerminalConsole from '../components/TerminalConsole';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const USAGE_DATA_FALLBACK = [
  { name: '00:00', bandwidth: 12, cpu: 15 },
  { name: '04:00', bandwidth: 45, cpu: 32 },
  { name: '08:00', bandwidth: 32, cpu: 55 },
  { name: '12:00', bandwidth: 85, cpu: 40 },
  { name: '16:00', bandwidth: 65, cpu: 48 },
  { name: '20:00', bandwidth: 95, cpu: 62 },
  { name: '23:59', bandwidth: 70, cpu: 45 },
];

function UsageChart({ title, dataKey, color, data }: { title: string, dataKey: string, color: string, data?: any[] }) {
  const chartData = data || USAGE_DATA_FALLBACK;

  return (
    <div className="glass-card rounded-3xl p-6 border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:opacity-20" style={{ backgroundColor: color }} />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
          <p className="text-[10px] text-slate-600 font-medium">Real-time resource monitor</p>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></span>
          <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Live</span>
        </div>
      </div>
      <div className="h-[150px] md:h-[180px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 9, fontWeight: 700 }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#050506', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill={`url(#color-${dataKey})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

type TabType = 'overview' | 'services' | 'billing' | 'support' | 'settings';

export default function Dashboard() {
  const { user, firebaseUser, loading, services, invoices, tickets, activities, notifications, updateServiceStatus, addTicket, updateProfile, logout, logActivity, markNotificationAsRead, reinstallOS, getOSTemplates, systemStatus } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showConsoleDirectly, setShowConsoleDirectly] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [osTemplates, setOsTemplates] = useState<any[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await getOSTemplates();
        setOsTemplates(templates);
      } catch (err) {
        console.error("Failed to fetch OS templates:", err);
      }
    };
    fetchTemplates();
  }, []);

  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending'>('All');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [metrics, setMetrics] = useState<{ cpu: string, ram: string, network: string, history: number[] } | null>(null);
  // systemStatus is now coming from useApp()

  // Poll for global system status - Removed, now handled in AppContext

  // Poll for real-time metrics when a service is selected
  useEffect(() => {
    if (!selectedService) {
      setMetrics(null);
      return;
    }

    const fetchMetrics = async () => {
      try {
        const res = await fetch(`/api/services/${selectedService.id}/metrics`);
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [selectedService]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#070708] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600/20 border-t-orange-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest animate-pulse">Syncing Infrastructure...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser || !user) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#070708] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
            <Lock className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-8">Please log in to your account to access the client dashboard.</p>
          <Link to="/login" className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all inline-block shadow-lg shadow-orange-600/20">
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePowerAction = async (id: string, action: 'reboot' | 'stop' | 'start') => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    try {
      // Map 'reboot' to Virtualizor's 'restart'
      const virtualizorAction = action === 'reboot' ? 'restart' : action;
      
      showToast(`Initiating ${action} for ${service.id}...`);
      await axios.post(`/api/services/${id}/power`, { action: virtualizorAction });

      if (action === 'reboot') {
        updateServiceStatus(id, 'Pending');
        await logActivity('Reboot', `Rebooted server ${service.name} (${service.ip})`);
        setTimeout(() => {
          updateServiceStatus(id, 'Active');
          showToast(`Server ${service.id} rebooted successfully!`, 'success');
        }, 3000);
      } else if (action === 'stop') {
        updateServiceStatus(id, 'Suspended');
        showToast(`Server ${service.id} has been stopped.`);
        await logActivity('Stop', `Stopped server ${service.name} (${service.ip})`);
      } else if (action === 'start') {
        updateServiceStatus(id, 'Pending');
        await logActivity('Start', `Started server ${service.name} (${service.ip})`);
        setTimeout(() => {
          updateServiceStatus(id, 'Active');
          showToast(`Server ${service.id} is now online.`, 'success');
        }, 2000);
      }
    } catch (err) {
      showToast(`Failed to perform ${action}`, 'error');
    }
  };

  const handleCreateTicket = (subject: string, message: string, priority: any) => {
    addTicket({
      subject,
      status: 'Open',
      priority: priority || 'Medium',
      lastUpdate: 'Just now'
    });
    setShowTicketForm(false);
    showToast('Ticket submitted successfully!');
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.ip.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeServicesCount = services.filter(s => s.status === 'Active').length;
  const unpaidInvoicesCount = invoices.filter(i => i.status === 'Unpaid').length;
  const openTicketsCount = tickets.filter(t => t.status === 'Open').length;

  const renderContent = () => {
    if (selectedService) {
      return (
        <ServiceDetail 
          service={services.find(s => s.id === selectedService.id) || selectedService} 
          onBack={() => {
            setSelectedService(null);
            setShowConsoleDirectly(false);
          }} 
          onPowerAction={handlePowerAction} 
          onReinstall={handleReinstall}
          osTemplates={osTemplates}
          metrics={metrics}
          initialShowConsole={showConsoleDirectly}
        />
      );
    }

    switch (activeTab) {
      case 'services':
        return (
          <ServicesTab 
            services={filteredServices} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onManage={setSelectedService} 
            onPowerAction={handlePowerAction}
            onTerminal={(svc: any) => {
              setSelectedService(svc);
              setShowConsoleDirectly(true);
            }}
          />
        );
      case 'billing':
        return <BillingTab invoices={invoices} />;
      case 'support':
        return (
          <SupportTab 
            tickets={tickets} 
            showForm={showTicketForm}
            setShowForm={setShowTicketForm}
            onSubmit={handleCreateTicket}
          />
        );
      case 'settings':
        return <SettingsTab user={user} activities={activities} onUpdate={updateProfile} showToast={showToast} firebaseUser={firebaseUser} logActivity={logActivity} services={services} tickets={tickets} />;
      default:
        return (
          <Overview 
            user={user}
            services={services} 
            invoices={invoices} 
            tickets={tickets} 
            activeServicesCount={activeServicesCount}
            unpaidInvoicesCount={unpaidInvoicesCount}
            openTicketsCount={openTicketsCount}
            onManage={setSelectedService}
            onPowerAction={handlePowerAction}
            onTerminal={(svc: any) => {
              setSelectedService(svc);
              setShowConsoleDirectly(true);
            }}
            systemStatus={systemStatus}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  const handleReinstall = async (serviceId: string, osId: string, pass: string) => {
    try {
      await reinstallOS(serviceId, osId, pass);
      updateServiceStatus(serviceId, 'Pending');
      showToast('OS Reinstallation initiated!', 'success');
      setTimeout(() => {
        updateServiceStatus(serviceId, 'Active');
        showToast('OS Reinstallation completed!', 'success');
      }, 10000);
    } catch (err) {
      showToast('Reinstallation failed', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-[#050506] overflow-hidden flex-col lg:flex-row">
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0A0A0B]/80 backdrop-blur-2xl border-t border-white/10 px-6 py-3 flex justify-between items-center shadow-2xl">
        <MobileNavItem icon={LayoutDashboard} active={activeTab === 'overview'} onClick={() => {setActiveTab('overview'); setSelectedService(null);}} />
        <MobileNavItem icon={Server} active={activeTab === 'services'} onClick={() => {setActiveTab('services'); setSelectedService(null);}} />
        <MobileNavItem icon={Plus} active={false} onClick={() => navigate('/vps')} special />
        <MobileNavItem icon={CreditCard} active={activeTab === 'billing'} onClick={() => {setActiveTab('billing'); setSelectedService(null);}} />
        <MobileNavItem icon={Settings} active={activeTab === 'settings'} onClick={() => {setActiveTab('settings'); setSelectedService(null);}} />
      </nav>

      {/* Sidebar - Desktop */}
      <aside className="w-64 border-r border-white/5 bg-[#070708] hidden lg:flex flex-col relative z-20 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-600/10 border border-orange-500/20 mb-8">
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">{user.avatar}</div>
            <div>
              <div className="text-sm font-bold text-white">{user.name}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Active Client</div>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => {setActiveTab('overview'); setSelectedService(null);}} />
            <NavItem icon={Server} label="Services" count={services.length} active={activeTab === 'services'} onClick={() => {setActiveTab('services'); setSelectedService(null);}} />
            <NavItem icon={CreditCard} label="Billing" count={unpaidInvoicesCount > 0 ? unpaidInvoicesCount : undefined} active={activeTab === 'billing'} onClick={() => {setActiveTab('billing'); setSelectedService(null);}} />
            <NavItem icon={TicketIcon} label="Support" count={tickets.length} active={activeTab === 'support'} onClick={() => {setActiveTab('support'); setSelectedService(null);}} />
          </nav>
        </div>

          <div className="mt-auto p-6 space-y-4">
            {user.role === 'admin' && (
              <Link to="/admin" className="w-full">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-600/10 border border-orange-500/20 mb-2 hover:bg-orange-600/20 transition-all group">
                  <Shield className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-white">Admin Area</span>
                </div>
              </Link>
            )}
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/20">
              <div className="text-xs font-bold text-white mb-2 uppercase tracking-tighter">Account Credit</div>
              <div className="text-2xl font-bold text-orange-500">$0.00</div>
              <button className="mt-3 w-full py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold rounded-lg border border-white/10 uppercase tracking-widest transition-all">
                Add Funds
              </button>
            </div>
            <NavItem 
              icon={Settings} 
              label="Account Settings" 
              active={activeTab === 'settings'} 
              onClick={() => {setActiveTab('settings'); setSelectedService(null);}} 
            />
            <Link to="/" className="w-full" onClick={logout}>
              <NavItem icon={LogOut} label="Log Out" color="text-red-500" />
            </Link>
          </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto relative pb-32 lg:pb-10">
        {/* Top Header Bar */}
        <div className="flex justify-end items-center mb-8 gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all relative group"
            >
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 border-2 border-[#070708] rounded-full flex items-center justify-center text-[8px] font-bold text-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Notifications</h3>
                    <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">{unreadCount} New</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${n.read ? 'opacity-60 grayscale' : 'bg-white/[0.01] hover:bg-white/[0.03]'}`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                              n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                              n.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                              n.type === 'error' ? 'bg-red-500/10 text-red-500' :
                              'bg-blue-500/10 text-blue-500'
                            }`}>
                              {n.type === 'success' ? <Zap className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-white mb-1 uppercase tracking-tight">{n.title}</div>
                              <p className="text-[10px] text-slate-500 leading-relaxed mb-2">{n.message}</p>
                              <div className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">
                                {new Date(n.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-slate-600">
                        <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white/[0.02] text-center">
                    <button className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-colors">Clear All</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (selectedService ? '-detail' : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub Components ---

function Overview({ user, services, invoices, tickets, activeServicesCount, unpaidInvoicesCount, openTicketsCount, onManage, onPowerAction, onTerminal, systemStatus, setActiveTab }: any) {
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {getTimeGreeting()}, <span className="text-orange-500">{user?.name || 'Client'}</span>!
          </h1>
          <p className="text-slate-500">Welcome back, manage your infrastructure here.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/vps" className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20">
            <Plus className="w-4 h-4" />
            New Order
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <StatCard icon={Zap} label="Active" value={activeServicesCount.toString()} color="text-orange-500" />
        <StatCard icon={Monitor} label="Global" value={systemStatus?.load || '0.00'} color="text-emerald-500" />
        <StatCard icon={Globe} label="Network" value={systemStatus?.globalTraffic || '0.0 Gbps'} color="text-blue-500" />
        <StatCard icon={Clock} label="Uptime" value={systemStatus?.uptime || '99.99%'} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <UsageChart title="Bandwidth Usage (Gbps)" dataKey="bandwidth" color="#ea580c" data={systemStatus?.history} />
        <UsageChart title="CPU Load (%)" dataKey="cpu" color="#3b82f6" data={systemStatus?.history} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2">
          <ServicesTable 
            services={services.slice(0, 5)} 
            onManage={onManage} 
            onPowerAction={onPowerAction} 
            onTerminal={onTerminal}
            title="Recent Services" 
          />
        </div>
        <div className="space-y-10">
          <section className="glass-card rounded-3xl p-8 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-600/10 transition-all" />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Security Status</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Account Protection</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">2FA Security</span>
                </div>
                <div className="px-2.5 py-1 bg-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                  Active
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group/item hover:bg-white/[0.04] transition-all">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Current Session</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-xs font-mono text-white">Active Connection</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Verified</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group/item hover:bg-white/[0.04] transition-all">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Login Session</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-xs text-white">Chrome on Windows</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('settings')}
              className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-all"
            >
              Security Settings
            </button>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-6">Recent Billing</h2>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4">
              {invoices.length > 0 ? (
                <>
                  {invoices.slice(0, 3).map((inv: Invoice) => (
                    <div key={inv.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{inv.number}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-widest">{inv.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{inv.currency} {inv.total}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${inv.status === 'Paid' ? 'text-emerald-500' : 'text-orange-500'}`}>
                          {inv.status}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setActiveTab('billing')}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    View Full History
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-slate-600 text-xs">No billing records</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function ServicesTab({ services, searchQuery, setSearchQuery, statusFilter, setStatusFilter, onManage, onPowerAction, onTerminal }: any) {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white">My Services</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and monitor your active instances.</p>
        </div>
        <Link to="/vps" className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Order New
        </Link>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input 
            type="text" 
            placeholder="Search by name or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          {['All', 'Active', 'Pending'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === status ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <ServicesTable 
        services={services} 
        onManage={onManage} 
        onPowerAction={onPowerAction} 
        onTerminal={onTerminal}
      />
      
      {services.length === 0 && (
        <div className="py-20 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
          <Server className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-white font-bold mb-1">No services found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}

function BillingTab({ invoices }: any) {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Billing & Invoices</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your payments and download invoices from WHMCS.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Add Funds
        </button>
      </header>
      <div className="glass-card rounded-2xl overflow-hidden border-white/5">
        {invoices.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((inv: Invoice) => (
                <tr key={inv.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-5 font-bold text-white">{inv.number}</td>
                  <td className="px-6 py-5 text-slate-400">{inv.date}</td>
                  <td className="px-6 py-5 text-slate-400">{inv.dueDate}</td>
                  <td className="px-6 py-5 text-white">{inv.currency} {inv.total}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 
                      inv.status === 'Unpaid' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <a 
                      href={`${import.meta.env.VITE_WHMCS_API_URL?.replace('/includes/api.php', '')}/viewinvoice.php?id=${inv.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 font-bold text-xs hover:underline"
                    >
                      {inv.status === 'Unpaid' ? 'Pay Now' : 'View Invoice'}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center">
            <CreditCard className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-1">No invoices found</h3>
            <p className="text-slate-500 text-sm">You don't have any billing history yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SupportTab({ tickets, showForm, setShowForm, onSubmit }: any) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    onSubmit(subject, message, priority);
    setSubject('');
    setMessage('');
    setPriority('Medium');
  };

  return (
    <div className="space-y-8 relative">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Support Tickets</h2>
          <p className="text-slate-500 text-sm mt-1">Our average response time is less than 30 minutes.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" /> Open New Ticket
        </button>
      </header>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-white/[0.02] border border-blue-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl -mr-32 -mt-32" />
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            Create New Support Ticket
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="Briefly describe your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Priority</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                >
                  <option value="Low" className="bg-[#0A0A0B]">Low</option>
                  <option value="Medium" className="bg-[#0A0A0B]">Medium</option>
                  <option value="High" className="bg-[#0A0A0B]">High</option>
                  <option value="Urgent" className="bg-[#0A0A0B]">Urgent</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Message</label>
              <textarea 
                rows={4}
                placeholder="Tell us more about the problem you are facing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                Submit Ticket
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">Ticket ID</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Update</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tickets.map((tkt: Ticket) => (
              <tr key={tkt.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-5 font-bold text-white">{tkt.id}</td>
                <td className="px-6 py-5 text-slate-400">{tkt.subject}</td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${tkt.status === 'Open' ? 'bg-orange-500/10 text-orange-500' : tkt.status === 'Answered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {tkt.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-400">{tkt.lastUpdate}</td>
                <td className="px-6 py-5 text-right">
                  <button className="text-orange-500 font-bold text-xs hover:underline">View Reply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServiceDetail({ service, onBack, onPowerAction, onReinstall, osTemplates, metrics, initialShowConsole = false }: any) {
  const [showConsole, setShowConsole] = useState(initialShowConsole);
  const [showReinstall, setShowReinstall] = useState(false);

  return (
    <div className="space-y-8">
      {showReinstall && (
        <ReinstallModal 
          templates={osTemplates} 
          onClose={() => setShowReinstall(false)} 
          onConfirm={(osId: string, pass: string) => {
            onReinstall(service.id, osId, pass);
            setShowReinstall(false);
          }} 
        />
      )}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Services
      </button>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center">
            <Server className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{service.name}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
              <code>{service.ip}</code>
              <span>•</span>
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${service.status === 'Active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-orange-500 animate-pulse'}`} />
                <span className={`font-bold uppercase tracking-widest text-[10px] ${service.status === 'Active' ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {service.status === 'Active' ? 'Online' : service.status === 'Pending' ? 'Processing' : 'Offline'}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {service.status === 'Suspended' ? (
            <button 
              onClick={() => onPowerAction(service.id, 'start')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" /> Start Server
            </button>
          ) : (
            <button 
              onClick={() => onPowerAction(service.id, 'stop')}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2"
            >
              <Power className="w-4 h-4" /> Stop Server
            </button>
          )}
          <button 
            onClick={() => onPowerAction(service.id, 'reboot')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg border border-white/10 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${service.status === 'Pending' ? 'animate-spin text-orange-500' : ''}`} /> Reboot
          </button>
          <button 
            onClick={() => setShowReinstall(true)}
            className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-sm font-bold rounded-lg border border-red-500/20 transition-all"
          >
            Reinstall OS
          </button>
          <button 
            onClick={() => setShowConsole(!showConsole)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-lg transition-all"
          >
            {showConsole ? 'Close Console' : 'Console Access'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {showConsole ? (
              <motion.div 
                key="console"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between p-4 bg-orange-600/10 border border-orange-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Active Console Session</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{service.ip} • root@firevps</div>
                </div>
                <TerminalConsole serviceId={service.id} />
              </motion.div>
            ) : (
              <motion.div 
                key="metrics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Hardware Specs */}
                <div className="grid grid-cols-3 gap-4">
                  <DetailStat icon={Cpu} label="CPU Usage" value={metrics?.cpu || '0%'} sub="2 vCPU Cores" />
                  <DetailStat icon={Monitor} label="RAM Usage" value={metrics?.ram || '0.0GB'} sub="4GB DDR4" />
                  <DetailStat icon={HardDrive} label="Storage" value="22GB" sub="80GB NVMe" />
                </div>
                
                {/* Usage Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UsageChart title="Bandwidth Monitor" dataKey="bandwidth" color="#ea580c" data={systemStatus?.history} />
                  <UsageChart title="CPU Load History" dataKey="cpu" color="#3b82f6" data={systemStatus?.history} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" /> Security Credentials
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Username</div>
                <div className="p-3 bg-white/5 rounded-xl text-sm text-white font-mono flex justify-between items-center">
                  Administrator
                  <FileText className="w-4 h-4 text-slate-600" />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Password</div>
                <div className="p-3 bg-white/5 rounded-xl text-sm text-white font-mono flex justify-between items-center">
                  ••••••••••••
                  <FileText className="w-4 h-4 text-slate-600" />
                </div>
              </div>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-all">
                Reset Root Password
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-orange-600/10 border border-orange-500/20">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Auto-Renewal</h3>
            <p className="text-xs text-slate-400 mb-4">Next billing cycle on Oct 24, 2026. $16.20 will be charged to your card.</p>
            <button className="text-xs text-orange-500 font-bold hover:underline">Change Billing Cycle</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({ icon: Icon, active, onClick, special }: any) {
  return (
    <button 
      onClick={onClick}
      className={`relative p-2 flex flex-col items-center gap-1 transition-all ${
        active ? 'text-orange-500 scale-110' : 'text-slate-500'
      } ${special ? 'bg-orange-600 rounded-2xl -mt-10 w-14 h-14 flex items-center justify-center text-white shadow-xl shadow-orange-600/40 border-4 border-[#070708]' : ''}`}
    >
      <Icon className={special ? 'w-6 h-6' : 'w-5 h-5'} />
      {active && <span className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full" />}
    </button>
  );
}

function ServicesTable({ services, onManage, onPowerAction, onTerminal, title }: any) {
  return (
    <section>
      {title && (
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button className="text-xs text-orange-500 font-bold hover:underline">View All</button>
        </div>
      )}
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action Center</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.map((service: Service) => (
              <tr key={service.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-orange-500/30 transition-colors">
                      <Server className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-glow transition-all">{service.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{service.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <code className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5 font-mono">{service.ip}</code>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    service.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'Active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]' : 'bg-orange-500 animate-pulse'}`} />
                    {service.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button 
                      onClick={() => onTerminal(service)}
                      className="p-2 bg-white/5 hover:bg-orange-600/20 text-slate-400 hover:text-orange-500 rounded-lg transition-all border border-white/5" 
                      title="Terminal Console"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </button>
                    {service.status === 'Active' ? (
                      <button 
                        onClick={() => onPowerAction(service.id, 'stop')}
                        className="p-2 bg-white/5 hover:bg-red-600/20 text-slate-400 hover:text-red-500 rounded-lg transition-all border border-white/5" 
                        title="Power Off"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => onPowerAction(service.id, 'start')}
                        className="p-2 bg-white/5 hover:bg-emerald-600/20 text-slate-400 hover:text-emerald-500 rounded-lg transition-all border border-white/5" 
                        title="Power On"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => onPowerAction(service.id, 'reboot')}
                      className="p-2 bg-white/5 hover:bg-orange-600/20 text-slate-400 hover:text-orange-500 rounded-lg transition-all border border-white/5" 
                      title="Reboot"
                    >
                      <RefreshCw className={`w-4 h-4 ${service.status === 'Pending' ? 'animate-spin text-orange-500' : ''}`} />
                    </button>
                    <button 
                      onClick={() => onManage(service)}
                      className="p-2 bg-orange-600/10 hover:bg-orange-600 text-orange-500 hover:text-white rounded-lg transition-all border border-orange-500/10" 
                      title="Advanced Management"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {services.map((service: Service) => (
          <div key={service.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{service.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{service.ip}</div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                service.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'Active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]' : 'bg-orange-500 animate-pulse'}`} />
                {service.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => onTerminal(service)}
                className="flex-1 py-3 bg-white/5 hover:bg-orange-600/20 text-white text-xs font-bold rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Console
              </button>
              <button 
                onClick={() => onManage(service)}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" /> Manage
              </button>
            </div>

            <div className="flex gap-2 border-t border-white/5 pt-4">
               {service.status === 'Active' ? (
                <button 
                  onClick={() => onPowerAction(service.id, 'stop')}
                  className="flex-1 py-2 bg-red-600/10 text-red-500 text-[10px] font-bold rounded-lg uppercase tracking-widest"
                >
                  Power Off
                </button>
              ) : (
                <button 
                  onClick={() => onPowerAction(service.id, 'start')}
                  className="flex-1 py-2 bg-emerald-600/10 text-emerald-500 text-[10px] font-bold rounded-lg uppercase tracking-widest"
                >
                  Power On
                </button>
              )}
              <button 
                onClick={() => onPowerAction(service.id, 'reboot')}
                className="flex-1 py-2 bg-white/5 text-slate-400 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-white/5"
              >
                Reboot
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NavItem({ icon: Icon, label, count, active, color = "text-slate-400", onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
        active 
          ? 'bg-orange-600/10 border border-orange-500/20 text-white glow-orange' 
          : 'hover:bg-white/[0.04] text-slate-400 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-orange-500 text-glow' : color} group-hover:text-orange-500 transition-colors`} />
        <span className={`text-sm font-bold tracking-tight ${active ? 'text-glow' : ''}`}>{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/40' : 'bg-white/10 text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className={`p-4 md:p-6 glass-card glass-card-hover rounded-2xl md:rounded-3xl flex flex-col justify-between group ${color.replace('text-', 'shadow-')}/10`}>
      <div className="flex justify-between items-start mb-2 md:mb-4">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center border border-white/5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${color} ${color.replace('text-', 'glow-')}`}>
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <div className="hidden sm:flex text-[9px] md:text-[10px] text-slate-600 font-bold uppercase tracking-widest group-hover:text-orange-500 transition-colors items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
          Live
        </div>
      </div>
      <div>
        <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1 group-hover:text-slate-400 transition-colors">{label}</div>
        <div className="text-xl md:text-3xl font-bold text-white tracking-tighter group-hover:text-glow transition-all">{value}</div>
      </div>
    </div>
  );
}

function DetailStat({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="p-6 glass-card rounded-3xl border-white/5 group hover:border-orange-500/30 transition-all duration-500">
      <div className="flex items-center gap-2 text-slate-500 mb-3 group-hover:text-orange-500 transition-colors">
        <Icon className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1 group-hover:text-glow transition-all">{value}</div>
      <div className="text-[10px] text-slate-600 font-medium uppercase tracking-tighter">{sub}</div>
    </div>
  );
}

function SettingsTab({ user, activities, onUpdate, showToast, firebaseUser, logActivity, services, tickets }: any) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [is2FAEnabled, setIs2FAEnabled] = useState(user.twoFactorEnabled || false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({ name, email, avatar: name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) });
    await logActivity('ProfileUpdate', 'Updated profile information');
    showToast('Profile updated successfully!');
  };

  const handlePasswordReset = async () => {
    if (!firebaseUser.email) return;
    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, firebaseUser.email);
      showToast('Password reset email sent!', 'success');
    } catch (err) {
      showToast('Failed to send reset email', 'error');
    } finally {
      setIsSendingReset(false);
    }
  };

  const toggle2FA = async () => {
    const newState = !is2FAEnabled;
    setIs2FAEnabled(newState);
    await onUpdate({ twoFactorEnabled: newState });
    await logActivity('ProfileUpdate', `${newState ? 'Enabled' : 'Disabled'} Two-Factor Authentication`);
    showToast(`2FA has been ${newState ? 'enabled' : 'disabled'}.`);
  };

  return (
    <div className="max-w-6xl space-y-10 pb-20 mx-auto">
      <header className="relative py-10 rounded-[40px] bg-gradient-to-br from-orange-600/10 via-transparent to-red-600/10 border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 blur-[100px] -ml-32 -mb-32" />
        
        <div className="relative z-10 px-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-1 flex items-center justify-center relative">
              <div className="w-full h-full bg-[#0A0A0B] rounded-[22px] flex items-center justify-center text-4xl font-black text-white shadow-inner">
                {user.avatar}
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform text-slate-900 border-4 border-[#0A0A0B]">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">{user.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-bold text-slate-300">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-600/20 border border-orange-500/30 rounded-full">
                <Shield className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{user.role} Account</span>
              </div>
            </div>
          </div>

          <div className="md:ml-auto grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-center">
              <div className="text-2xl font-black text-white">{services.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Services</div>
            </div>
            <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-center">
              <div className="text-2xl font-black text-white">{tickets.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tickets</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                <User className="w-4 h-4 text-orange-500" /> Identity Information
              </h3>
            </div>
            <form onSubmit={handleUpdate} className="glass-card rounded-[32px] p-8 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative group/input">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-orange-500 transition-colors" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-orange-500 transition-colors" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-600/20 flex items-center justify-center gap-3 group">
                Save Profile Configuration
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
              <Lock className="w-4 h-4 text-blue-500" /> Security Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-[32px] p-6 border-emerald-500/5 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Smartphone className="w-6 h-6 text-emerald-500" />
                  </div>
                  <button 
                    onClick={toggle2FA}
                    className={`w-14 h-7 rounded-full transition-all relative p-1 ${is2FAEnabled ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-lg ${is2FAEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div>
                  <div className="text-lg font-bold text-white mb-1 tracking-tight">Two-Factor Auth</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Protect your account with a secondary verification code.</p>
                </div>
              </div>

              <div className="glass-card rounded-[32px] p-6 border-blue-500/5 hover:border-blue-500/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-8">
                  <Lock className="w-6 h-6 text-blue-500" />
                </div>
                <div className="mb-6">
                  <div className="text-lg font-bold text-white mb-1 tracking-tight">Access Credentials</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Regularly update your password to maintain security.</p>
                </div>
                <button 
                  onClick={handlePasswordReset}
                  disabled={isSendingReset}
                  className="w-full py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white text-xs font-black rounded-xl border border-blue-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  {isSendingReset ? 'Processing...' : 'Reset Password'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        </div>

        <section className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
              <ActivityIcon className="w-4 h-4 text-orange-500" /> Activity Stream
            </h3>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-600/10 px-2 py-0.5 rounded-full border border-orange-500/20">Live Logs</span>
          </div>
          <div className="glass-card rounded-[32px] overflow-hidden border-white/5 flex flex-col max-h-[800px]">
            <div className="divide-y divide-white/5 overflow-y-auto custom-scrollbar">
              {activities.length > 0 ? (
                activities.map((activity: any, idx: number) => (
                  <div key={activity.id} className="p-6 flex items-start gap-5 hover:bg-white/[0.02] transition-all relative group">
                    {idx < activities.length - 1 && (
                      <div className="absolute left-[44px] top-14 bottom-0 w-0.5 bg-gradient-to-b from-white/10 to-transparent group-hover:from-orange-500/20 transition-colors" />
                    )}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-12 ${
                      activity.type === 'Login' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/10' :
                      activity.type === 'Reboot' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500 shadow-lg shadow-orange-500/10' :
                      activity.type === 'ProfileUpdate' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500 shadow-lg shadow-blue-500/10' :
                      'bg-slate-500/10 border-slate-500/20 text-slate-400 shadow-lg shadow-slate-500/10'
                    }`}>
                      {activity.type === 'Login' ? <Zap className="w-4 h-4" /> :
                       activity.type === 'Reboot' ? <RefreshCw className="w-3 h-3" /> :
                       activity.type === 'ProfileUpdate' ? <User className="w-4 h-4" /> :
                       <ActivityIcon className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-black text-white mb-1 group-hover:text-orange-500 transition-colors">{activity.description}</div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-32 text-center text-slate-600">
                  <ActivityIcon className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No activity recorded</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
              <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-orange-500 transition-colors">Export Activity Logs</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ReinstallModal({ templates, onClose, onConfirm }: any) {
  const [selectedOs, setSelectedOs] = useState(templates[0]?.id || '');
  const [password, setPassword] = useState('');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#0A0A0B] border border-white/10 rounded-3xl p-8 shadow-2xl relative"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <RefreshCw className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Reinstall Operating System</h2>
          <p className="text-slate-500 text-sm">Warning: All data on this server will be permanently deleted. This action cannot be undone.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Select OS Template</label>
            <select 
              value={selectedOs}
              onChange={(e) => setSelectedOs(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-red-500/50 appearance-none"
            >
              {templates.map((t: any) => (
                <option key={t.id} value={t.id} className="bg-[#0A0A0B] text-white">{t.name || t.id}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">New Root Password</label>
            <input 
              type="password" 
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-red-500/50"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => onConfirm(selectedOs, password)}
              disabled={!password || password.length < 8}
              className="flex-1 py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20"
            >
              Start Reinstallation
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

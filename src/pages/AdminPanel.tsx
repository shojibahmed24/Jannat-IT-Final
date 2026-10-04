import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, Service, UserProfile, Ticket } from '../context/AppContext';
import { 
  Users, 
  Server, 
  Ticket as TicketIcon, 
  CreditCard, 
  Shield, 
  Activity, 
  Search,
  Settings,
  TrendingUp,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

type AdminTab = 'overview' | 'users' | 'services' | 'tickets' | 'billing';

export default function AdminPanel() {
  const { user, allUsers, allServices, allTickets, allActivities, systemStatus, settings, updateSettings, loading } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return null;
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center p-6">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-slate-500">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement users={allUsers} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case 'services':
        return <ServiceManagement services={allServices} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case 'tickets':
        return <TicketManagement tickets={allTickets} />;
      case 'billing':
        return <BillingManagement settings={settings} onUpdate={updateSettings} />;
      default:
        return (
          <AdminOverview 
            totalUsers={allUsers.length} 
            totalServices={allServices.length} 
            openTickets={allTickets.filter(t => t.status === 'Open').length}
            activities={allActivities}
            systemStatus={systemStatus}
            allInvoices={allInvoices}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070708]">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0A0B] flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tighter text-xl">Jannat<span className="text-orange-500"> IT</span></span>
          </div>

          <nav className="space-y-2">
            <AdminNavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <AdminNavItem icon={Users} label="Users" count={allUsers.length} active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <AdminNavItem icon={Server} label="All VPS" count={allServices.length} active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
            <AdminNavItem icon={TicketIcon} label="Tickets" count={allTickets.filter(t => t.status === 'Open').length} active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} />
            <AdminNavItem icon={CreditCard} label="Billing" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
            <AdminNavItem icon={Settings} label="Settings" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">{user.avatar}</div>
            <div>
              <div className="text-sm font-bold text-white truncate w-32">{user.name}</div>
              <div className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function AdminNavItem({ icon: Icon, label, count, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${active ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20' : 'hover:bg-white/[0.02] text-slate-500'}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${active ? 'text-orange-500' : 'text-slate-600 group-hover:text-slate-400'}`} />
        <span className="text-sm font-bold">{label}</span>
      </div>
      {count !== undefined && count > 0 && <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-600/20 text-orange-500 rounded-full">{count}</span>}
    </button>
  );
}

function AdminOverview({ totalUsers, totalServices, openTickets, activities, systemStatus, allInvoices }: any) {
  const totalRevenue = allInvoices
    ? allInvoices
        .filter((inv: any) => inv.status === 'Paid')
        .reduce((sum: number, inv: any) => sum + parseFloat(inv.total || 0), 0)
    : 0;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">System Control</h1>
        <p className="text-slate-500">Real-time status of your entire VPS infrastructure.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} change="From WHMCS" icon={TrendingUp} color="text-emerald-500" />
        <AdminStatCard label="Active Users" value={totalUsers.toString()} change="Real-time" icon={Users} color="text-blue-500" />
        <AdminStatCard label="Live Instances" value={totalServices.toString()} change="Real-time" icon={Server} color="text-orange-500" />
        <AdminStatCard label="Pending Support" value={openTickets.toString()} change="Active" icon={TicketIcon} color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Recent User Activity</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {activities && activities.length > 0 ? (
              activities.map((act: any) => (
                <ActivityItem 
                  key={act.id}
                  type={act.type} 
                  user={act.description.split(' ')[0]} 
                  time={new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                />
              ))
            ) : (
              <div className="text-center py-10 text-slate-600 text-sm italic">No recent activity</div>
            )}
          </div>
        </section>

        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Infrastructure Load</h3>
          <div className="space-y-6">
            <LoadBar label="CPU Clusters" value={systemStatus?.cpuLoad || 0} />
            <LoadBar label="RAM Usage" value={systemStatus?.ramLoad || 0} color="bg-orange-600" />
            <LoadBar label="IP Address Pool" value={Math.round(Math.min(100, (totalServices / 100) * 100))} color="bg-blue-600" />
          </div>
        </section>
      </div>
    </div>
  );
}

function UserManagement({ users, searchQuery, setSearchQuery }: any) {
  const filteredUsers = users.filter((u: any) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">User Management</h2>
          <p className="text-slate-500">Manage {users.length} registered accounts.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
          />
        </div>
      </header>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">WHMCS ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((u: UserProfile, i: number) => (
              <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-orange-500 transition-colors">
                      {u.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400">{u.whmcsClientId || 'N/A'}</td>
                <td className="px-6 py-5">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-slate-600 hover:text-white transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServiceManagement({ services, searchQuery, setSearchQuery }: any) {
  const filteredServices = services.filter((s: any) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.ip.includes(searchQuery));

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Infrastructure Control</h2>
          <p className="text-slate-500">Monitor and manage all {services.length} instances.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input 
            type="text" 
            placeholder="Search instances or IPs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
          />
        </div>
      </header>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">Instance</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredServices.map((s: Service, i: number) => (
              <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-orange-600/10 flex items-center justify-center">
                      <Server className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{s.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <code className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded">{s.ip}</code>
                </td>
                <td className="px-6 py-5 text-xs text-slate-500 font-mono">{(s as any).userEmail || `USER-${s.id.slice(0, 8)}`}</td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold rounded uppercase tracking-widest transition-all">Manage</button>
                    <button className="px-3 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-[10px] font-bold rounded uppercase tracking-widest transition-all">Terminate</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TicketManagement({ tickets }: any) {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white">Support Helpdesk</h2>
        <p className="text-slate-500">Monitor and respond to customer queries.</p>
      </header>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">Ticket</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Update</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tickets.map((t: Ticket, i: number) => (
              <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-white">{t.subject}</div>
                  <div className="text-[10px] text-slate-500">{t.id}</div>
                </td>
                <td className="px-6 py-5">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    t.priority === 'Urgent' ? 'text-red-500' : 
                    t.priority === 'High' ? 'text-orange-500' : 
                    t.priority === 'Medium' ? 'text-blue-500' : 
                    'text-slate-500'
                  }`}>
                    {t.priority || 'Normal'}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${t.status === 'Open' ? 'bg-blue-500/10 text-blue-500' : t.status === 'Answered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400">{t.lastUpdate}</td>
                <td className="px-6 py-5 text-right">
                  <button className="text-orange-500 font-bold text-xs hover:underline">Open Ticket</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BillingManagement({ settings, onUpdate }: any) {
  const [domainPrice, setDomainPrice] = useState(settings.domainPrice);
  const [vpsMarkup, setVpsMarkup] = useState(settings.vpsMarkup);
  const [whmcsUrl, setWhmcsUrl] = useState(settings.whmcsUrl);
  const [whmcsApiUrl, setWhmcsApiUrl] = useState(settings.whmcsApiUrl);
  const [checkoutMode, setCheckoutMode] = useState(settings.checkoutMode || 'whmcs');
  const [manualRedirectUrl, setManualRedirectUrl] = useState(settings.manualRedirectUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate({ 
        ...settings, 
        domainPrice: Number(domainPrice), 
        vpsMarkup: Number(vpsMarkup),
        whmcsUrl,
        whmcsApiUrl,
        checkoutMode,
        manualRedirectUrl
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePaymentMethod = async (id: string) => {
    const newMethods = settings.paymentMethods.map((m: any) => 
      m.id === id ? { ...m, active: !m.active } : m
    );
    await onUpdate({ ...settings, paymentMethods: newMethods });
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Billing & Pricing</h2>
          <p className="text-slate-500">Manage global prices and payment configuration.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-500" /> Domain Pricing
          </h3>
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Base Price (.com)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                <input 
                  type="number" 
                  value={domainPrice}
                  onChange={(e) => setDomainPrice(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-8 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed italic">This price will be used globally for domain availability checks and ordering.</p>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" /> VPS Markup
          </h3>
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Global Markup (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={vpsMarkup}
                  onChange={(e) => setVpsMarkup(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed italic">Add a percentage markup to all base WHMCS product prices shown on the site.</p>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-orange-500" /> Checkout Integration
          </h3>
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Checkout Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setCheckoutMode('whmcs')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${checkoutMode === 'whmcs' ? 'border-orange-500 bg-orange-600/10 text-white' : 'border-white/5 bg-white/[0.01] text-slate-500 hover:text-white'}`}
                >
                  <RefreshCw className={`w-4 h-4 ${checkoutMode === 'whmcs' ? 'text-orange-500' : ''}`} />
                  <span className="text-sm font-bold">WHMCS API</span>
                </button>
                <button 
                  onClick={() => setCheckoutMode('manual')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${checkoutMode === 'manual' ? 'border-orange-500 bg-orange-600/10 text-white' : 'border-white/5 bg-white/[0.01] text-slate-500 hover:text-white'}`}
                >
                  <ArrowRight className={`w-4 h-4 ${checkoutMode === 'manual' ? 'text-orange-500' : ''}`} />
                  <span className="text-sm font-bold">Manual Redirect</span>
                </button>
              </div>
            </div>

            {checkoutMode === 'whmcs' ? (
              <div className="space-y-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">WHMCS Base URL</label>
                  <input 
                    type="text" 
                    value={whmcsUrl}
                    onChange={(e) => setWhmcsUrl(e.target.value)}
                    placeholder="https://billing.yourdomain.com"
                    className={`w-full bg-white/[0.03] border rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all ${whmcsUrl.includes('yourdomain.com') ? 'border-orange-500/50' : 'border-white/5 focus:border-orange-500/50'}`}
                  />
                  {whmcsUrl.includes('yourdomain.com') && (
                    <p className="text-[9px] text-orange-500 font-bold uppercase tracking-tighter mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Still using placeholder URL
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">WHMCS API URL (api.php)</label>
                  <input 
                    type="text" 
                    value={whmcsApiUrl}
                    onChange={(e) => setWhmcsApiUrl(e.target.value)}
                    placeholder="https://billing.yourdomain.com/includes/api.php"
                    className={`w-full bg-white/[0.03] border rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all ${whmcsApiUrl.includes('yourdomain.com') ? 'border-orange-500/50' : 'border-white/5 focus:border-orange-500/50'}`}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Manual Checkout URL</label>
                  <input 
                    type="text" 
                    value={manualRedirectUrl}
                    onChange={(e) => setManualRedirectUrl(e.target.value)}
                    placeholder="https://billing.yourdomain.com/cart.php?a=add&pid=1"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
                  />
                  <p className="text-[10px] text-slate-600 leading-relaxed italic">Users will be redirected to this exact URL when they click "Checkout". WHMCS API will be bypassed.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-orange-500" /> Active Payment Methods
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {settings.paymentMethods.map((m: any) => (
            <div key={m.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex justify-between items-center group hover:bg-white/[0.04] transition-colors">
              <div>
                <div className="text-sm font-bold text-white">{m.name}</div>
                <div className="text-[10px] text-slate-600 uppercase tracking-widest">{m.active ? 'Enabled' : 'Disabled'}</div>
              </div>
              <button 
                onClick={() => togglePaymentMethod(m.id)}
                className={`w-10 h-5 rounded-full relative transition-all ${m.active ? 'bg-orange-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${m.active ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AdminStatCard({ label, value, change, icon: Icon, color }: any) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-white/10 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">{change}</div>
      </div>
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-3xl font-bold text-white">{value}</div>
      </div>
    </div>
  );
}

function ActivityItem({ type, user, time }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${type === 'Login' ? 'bg-emerald-500' : type === 'Order' ? 'bg-orange-500' : 'bg-blue-500'}`} />
        <div className="text-sm font-bold text-white">{type}: <span className="text-slate-400 font-medium">{user}</span></div>
      </div>
      <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{time}</div>
    </div>
  );
}

function LoadBar({ label, value, color = "bg-emerald-500" }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-slate-500">{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

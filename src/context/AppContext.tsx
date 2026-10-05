import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface DataErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleDataError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: DataErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  }
  console.error('Data Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Service {
  id: string;
  name: string;
  ip: string;
  status: 'Active' | 'Pending' | 'Suspended';
  expires: string;
  type: 'VPS' | 'RDP' | 'Dedicated';
  location: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  total: string;
  status: string;
  currency: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  status: 'Open' | 'Closed' | 'Answered';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  lastUpdate: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  whmcsClientId?: string;
  twoFactorEnabled?: boolean;
  role: 'user' | 'admin';
}

export interface Activity {
  id: string;
  type: 'Login' | 'Reboot' | 'Stop' | 'Start' | 'ProfileUpdate' | 'TicketOpen' | 'Order';
  description: string;
  timestamp: any;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: any;
}

interface AppContextType {
  user: UserProfile | null;
  services: Service[];
  invoices: Invoice[];
  tickets: Ticket[];
  activities: Activity[];
  notifications: Notification[];
  allUsers: UserProfile[];
  allServices: (Service & { userEmail?: string })[];
  allTickets: Ticket[];
  allActivities: Activity[];
  allInvoices: any[];
  systemStatus: { uptime: string, load: string, globalTraffic: string, activeUsers: number, activeServices: number, openTickets: number, cpuLoad: number, ramLoad: number, history?: any[] } | null;
  settings: any;
  links: Record<string, string>;
  loading: boolean;
  updateSettings: (newSettings: any) => Promise<void>;
  updateLink: (slug: string, url: string, name: string) => Promise<void>;
  fetchLinks: () => Promise<void>;
  addService: (service: any) => Promise<void>;
  updateServiceStatus: (id: string, status: any) => Promise<void>;
  addTicket: (ticket: any) => Promise<void>;
  updateProfile: (profile: any) => Promise<void>;
  logout: () => Promise<void>;
  syncWithWHMCS: () => Promise<any>;
  createWHMCSOrder: (order: any) => Promise<any>;
  logActivity: (activity: any) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  reinstallOS: (id: string, os: string) => Promise<void>;
  getOSTemplates: (id: string) => Promise<any[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Record<string, string>>({
    'client_login': 'https://billing.jannatit.com/clientarea.php',
    'order_now': 'https://billing.jannatit.com/cart.php?a=add&pid=1',
    'vps_order': 'https://billing.jannatit.com/cart.php?gid=1',
    'rdp_order': 'https://billing.jannatit.com/cart.php?gid=2',
    'hosting_order': 'https://billing.jannatit.com/cart.php?gid=3'
  });
  const [settings, setSettings] = useState<any>({
    domainPrice: 9.99,
    vpsMarkup: 0,
    whmcsUrl: 'https://billing.jannatit.com',
    whmcsApiUrl: 'https://billing.jannatit.com/includes/api.php',
    paymentMethods: [
      { id: 'paypal', name: 'PayPal', active: true },
      { id: 'stripe', name: 'Credit Card', active: true },
      { id: 'bkash', name: 'bKash', active: true }
    ]
  });
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await axios.get('/api/links');
      if (Array.isArray(response.data)) {
        const linkMap: Record<string, string> = {};
        response.data.forEach((l: any) => {
          linkMap[l.slug] = l.url;
        });
        setLinks(prev => ({ ...prev, ...linkMap }));
      }
    } catch (err) {
      console.error("Failed to fetch links:", err);
    }
  };

  const updateLink = async (slug: string, url: string, name: string) => {
    try {
      await axios.post('/api/links', { slug, url, name });
      await fetchLinks();
    } catch (err) {
      console.error("Failed to update link:", err);
    }
  };

  const updateSettings = async (newSettings: any) => {
    try {
      await axios.post('/api/settings', newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  useEffect(() => {
    fetchLinks();
    fetchSettings();
    
    // In Supabase, we could use realtime subscriptions, but for settings, a simple fetch is fine
    // Or we could set up a subscription to the 'settings' table here
    const subscription = supabase
      .channel('public:settings')
      .on('postgres_changes' as any, { event: '*', table: 'settings', filter: 'id=eq.global' }, (payload: any) => {
        if (payload.new && (payload.new as any).value) {
          setSettings((payload.new as any).value);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const res = await fetch('/api/system/status');
        const data = await res.json();
        setSystemStatus(data);
      } catch (err) {
        console.error("Failed to fetch system status:", err);
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ 
      loading,
      systemStatus,
      settings,
      updateSettings,
      links,
      updateLink,
      fetchLinks,
      // Provide dummy/empty values for any remaining components that might still reference them
      user: null,
      services: [],
      invoices: [],
      tickets: [],
      activities: [],
      notifications: [],
      allUsers: [],
      allServices: [],
      allTickets: [],
      allActivities: [],
      allInvoices: [],
      addService: async () => {},
      updateServiceStatus: async () => {},
      addTicket: async () => {},
      updateProfile: async () => {},
      logout: async () => {},
      syncWithWHMCS: async () => null,
      createWHMCSOrder: async () => ({}),
      logActivity: async () => {},
      markNotificationAsRead: async () => {},
      reinstallOS: async () => {},
      getOSTemplates: async () => []
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

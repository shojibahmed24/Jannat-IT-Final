import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  updateDoc,
  Timestamp,
  orderBy,
  serverTimestamp,
  limit,
  getDocFromServer
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

import axios from 'axios';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
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
  firebaseUser: User | null;
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
  loading: boolean;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateServiceStatus: (id: string, status: Service['status']) => Promise<void>;
  addTicket: (ticket: Omit<Ticket, 'id'>) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  syncWithWHMCS: () => Promise<void>;
  createWHMCSOrder: (pid: string, billingCycle: string) => Promise<any>;
  logActivity: (type: Activity['type'], description: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  reinstallOS: (serviceId: string, osId: string, pass: string) => Promise<void>;
  getOSTemplates: () => Promise<any[]>;
  updateSettings: (newSettings: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allServices, setAllServices] = useState<(Service & { userEmail?: string })[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [allInvoices, setAllInvoices] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<{ uptime: string, load: string, globalTraffic: string, activeUsers: number, activeServices: number, openTickets: number, cpuLoad: number, ramLoad: number, history?: any[] } | null>(null);
  const [settings, setSettings] = useState<any>({
    domainPrice: 9.99,
    vpsMarkup: 0,
    whmcsUrl: 'https://billing.yourdomain.com',
    whmcsApiUrl: 'https://billing.yourdomain.com/includes/api.php',
    paymentMethods: [
      { id: 'paypal', name: 'PayPal', active: true },
      { id: 'stripe', name: 'Credit Card', active: true },
      { id: 'bkash', name: 'bKash', active: true }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncWithWHMCS = async (): Promise<string | null> => {
    if (!firebaseUser || !userProfile || isSyncing) return userProfile?.whmcsClientId || null;
    setIsSyncing(true);
    try {
      const response = await axios.post('/api/whmcs/sync', {
        email: firebaseUser.email,
        firstName: userProfile.name.split(' ')[0],
        lastName: userProfile.name.split(' ').slice(1).join(' ') || 'Jannat IT'
      });
      
      if (response.data.clientId) {
        await updateProfile({ whmcsClientId: response.data.clientId });
        // Fetch invoices after sync
        fetchWHMCSInvoices(response.data.clientId);
        return response.data.clientId;
      }
      return null;
    } catch (error: any) {
      console.error('WHMCS Sync Error:', error);
      const message = error.response?.data?.error || error.message;
      if (message === 'WHMCS API URL not configured') {
        throw new Error('WHMCS integration is not yet configured by the administrator.');
      }
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchWHMCSInvoices = async (clientId: string) => {
    try {
      const response = await axios.get(`/api/whmcs/invoices?clientId=${clientId}`);
      if (response.data.invoices) {
        setInvoices(response.data.invoices);
      }
    } catch (error) {
      console.error('Fetch Invoices Error:', error);
    }
  };

  const createWHMCSOrder = async (pid: string, billingCycle: string) => {
    let clientId = userProfile?.whmcsClientId;
    if (!clientId) {
      clientId = (await syncWithWHMCS()) || undefined;
    }
    
    if (!clientId) throw new Error('Client not synced');

    const response = await axios.post('/api/whmcs/create-order', {
      clientId,
      pid,
      billingCycle
    });
    
    await logActivity('Order', `Ordered Product PID: ${pid}`);
    return response.data;
  };

  const logActivity = async (type: Activity['type'], description: string) => {
    if (!firebaseUser) return;
    const path = 'activities';
    try {
      await addDoc(collection(db, path), {
        userId: firebaseUser.uid,
        type,
        description,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    const path = `notifications/${id}`;
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const reinstallOS = async (serviceId: string, osId: string, pass: string) => {
    await axios.post(`/api/services/${serviceId}/reinstall`, { osid: osId, password: pass });
    await logActivity('Reboot', `Initiated OS Reinstall for server ${serviceId}`);
  };

  const getOSTemplates = async () => {
    const response = await axios.get('/api/os-templates');
    return response.data.templates || [];
  };

  const updateSettings = async (newSettings: any) => {
    const path = 'settings/global';
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        ...newSettings,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/global');
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        let profileData: UserProfile;
        
        try {
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Check if this is the first user or the user specified in the brief to be admin
            const isAdminEmail = user.email === 'shojib4chatgpt@gmail.com';
            profileData = {
              name: user.displayName || "New User",
              email: user.email || "",
              avatar: (user.displayName || "U").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
              role: isAdminEmail ? 'admin' : 'user'
            };
            await setDoc(userDocRef, { ...profileData, createdAt: Timestamp.now() });
            setUserProfile(profileData);
            
            // Send Welcome Email via server proxy
            try {
              await axios.post('/api/email/welcome', { email: profileData.email, name: profileData.name });
            } catch (e) {
              console.error("Failed to trigger welcome email:", e);
            }
          } else {
            profileData = userDoc.data() as UserProfile;
            setUserProfile(profileData);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          return;
        }

        // Admin Specific Listeners
        let unsubUsers = () => {};
        let unsubAllServices = () => {};
        let unsubAllTickets = () => {};
        let unsubAllActivities = () => {};

        if (profileData.role === 'admin') {
          const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
          const servicesGlobalQuery = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
          const ticketsGlobalQuery = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
          const activitiesGlobalQuery = query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(50));

          // Fetch all invoices for admin revenue calculation
          const fetchAllInvoices = async () => {
            try {
              const res = await fetch('/api/whmcs/all-invoices');
              const data = await res.json();
              if (data.invoices) setAllInvoices(data.invoices);
            } catch (err) {
              console.error("Failed to fetch all invoices:", err);
            }
          };
          fetchAllInvoices();

          unsubUsers = onSnapshot(usersQuery, (snapshot) => {
            setAllUsers(snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile)));
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, 'users');
          });

          unsubAllServices = onSnapshot(servicesGlobalQuery, (snapshot) => {
            setAllServices(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Service)));
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, 'services');
          });

          unsubAllTickets = onSnapshot(ticketsGlobalQuery, (snapshot) => {
            setAllTickets(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Ticket)));
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, 'tickets');
          });

          unsubAllActivities = onSnapshot(activitiesGlobalQuery, (snapshot) => {
            setAllActivities(snapshot.docs.map(doc => ({ 
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate() || new Date()
            } as Activity)));
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, 'activities');
          });
        }

        // Fetch invoices if client ID exists
        if (profileData.whmcsClientId) {
          fetchWHMCSInvoices(profileData.whmcsClientId);
        }

        // Real-time listeners
        const servicesQuery = query(collection(db, 'services'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const ticketsQuery = query(collection(db, 'tickets'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const activitiesQuery = query(collection(db, 'activities'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(50));
        const notificationsQuery = query(collection(db, 'notifications'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(20));

        const unsubServices = onSnapshot(servicesQuery, (snapshot) => {
          setServices(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Service)));
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'services');
        });

        const unsubTickets = onSnapshot(ticketsQuery, (snapshot) => {
          setTickets(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Ticket)));
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'tickets');
        });

        const unsubActivities = onSnapshot(activitiesQuery, (snapshot) => {
          setActivities(snapshot.docs.map(doc => ({ 
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
          } as Activity)));
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'activities');
        });

        const unsubNotifications = onSnapshot(notificationsQuery, (snapshot) => {
          setNotifications(snapshot.docs.map(doc => ({ 
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
          } as Notification)));
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'notifications');
        });

        setLoading(false);
        return () => {
          unsubServices();
          unsubTickets();
          unsubActivities();
          unsubNotifications();
          unsubUsers();
          unsubAllServices();
          unsubAllTickets();
          unsubAllActivities();
        };
      } else {
        setUserProfile(null);
        setServices([]);
        setInvoices([]);
        setTickets([]);
        setLoading(false);
      }
    });

    return () => {
      unsubSettings();
      unsubscribe();
    };
  }, [firebaseUser]);

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
    const interval = setInterval(fetchSystemStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const addService = async (service: Omit<Service, 'id'>) => {
    if (!firebaseUser) return;
    await addDoc(collection(db, 'services'), {
      ...service,
      userId: firebaseUser.uid,
      createdAt: Timestamp.now()
    });
  };

  const updateServiceStatus = async (id: string, status: Service['status']) => {
    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, { status });
  };

  const addTicket = async (ticket: Omit<Ticket, 'id' | 'userId'>) => {
    if (!firebaseUser) return;
    await addDoc(collection(db, 'tickets'), {
      ...ticket,
      userId: firebaseUser.uid,
      status: ticket.status || 'Open',
      priority: ticket.priority || 'Medium',
      lastUpdate: new Date().toLocaleString(),
      createdAt: Timestamp.now()
    });
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!firebaseUser) return;
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(userDocRef, profile);
    setUserProfile(prev => prev ? { ...prev, ...profile } : null);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AppContext.Provider value={{ 
      user: userProfile, 
      firebaseUser, 
      services, 
      invoices, 
      tickets, 
      loading,
      addService, 
      updateServiceStatus, 
      addTicket, 
      updateProfile, 
      logout,
      syncWithWHMCS,
      createWHMCSOrder,
      logActivity,
      activities,
      notifications,
      markNotificationAsRead,
      reinstallOS,
      getOSTemplates,
      allUsers,
      allServices,
      allTickets,
      settings,
      updateSettings
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

import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import https from 'https';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create an HTTPS agent that ignores SSL certificate errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  checkServerIdentity: () => undefined
});

// Supabase Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

// SMTP Transporter Configuration
const transporter = nodemailer.createTransport({
  host: process.env.VITE_SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.VITE_SMTP_PORT || '465'),
  secure: parseInt(process.env.VITE_SMTP_PORT || '465') === 465,
  auth: process.env.VITE_SMTP_USER ? {
    user: process.env.VITE_SMTP_USER,
    pass: process.env.VITE_SMTP_PASS,
  } : undefined,
});

console.log('Supabase client initialized.');

// Helper: Send Real Email via Nodemailer
async function sendEmail(to: string, subject: string, html: string, text?: string) {
  if (!process.env.VITE_SMTP_USER || !process.env.VITE_SMTP_PASS) {
    console.warn('[EMAIL SKIP] SMTP credentials not configured. Skipping email to:', to);
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.VITE_EMAIL_FROM || '"Jannat IT Support" <noreply@jannatit.com>',
      to,
      subject,
      text: text || 'Please view this email in an HTML compatible viewer.',
      html,
    });
    console.log(`[EMAIL SENT] Message ID: ${info.messageId} | To: ${to}`);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send email:', error);
  }
}

async function getGlobalSettings() {
  const defaultSettings = {
    domainPrice: 9.99,
    vpsMarkup: 0,
    whmcsUrl: 'https://billing.jannatit.com',
    whmcsApiUrl: 'https://billing.jannatit.com/includes/api.php',
    checkoutMode: 'whmcs',
    manualRedirectUrl: 'https://billing.jannatit.com/cart.php?a=add&pid=1',
    paymentMethods: [
      { id: 'paypal', name: 'PayPal', active: true },
      { id: 'stripe', name: 'Credit Card', active: true },
      { id: 'bkash', name: 'bKash', active: true }
    ]
  };

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (error || !data) {
      // If table doesn't exist or no data, return default
      // Note: We don't auto-create tables in Supabase via JS client usually without schema
      return defaultSettings;
    }
    return { ...defaultSettings, ...data.value };
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return defaultSettings;
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  app.use(express.json());

  const apiRouter = express.Router();
  
  // API Routes
  apiRouter.get('/test', (req, res) => {
    res.json({ message: 'API is working' });
  });

  apiRouter.get('/domain/check', async (req, res) => {
    const { domain } = req.query;
    if (!domain || typeof domain !== 'string') return res.status(400).json({ error: 'Domain is required' });
    try {
      const response = await axios.get(`https://dns.google/resolve?name=${domain}&type=A`);
      const settings = await getGlobalSettings();
      const domainPrice = settings?.domainPrice || 9.99;

      res.json({
        domain,
        available: response.data.Status === 3,
        status: response.data.Status === 0 ? 'Registered' : 'Available',
        price: domainPrice.toString()
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check domain' });
    }
  });

  apiRouter.get('/services/:id/metrics', async (req, res) => {
    const history = Array.from({ length: 15 }, () => Math.floor(Math.random() * 30 + 10));
    res.json({ 
      cpu: `${(Math.random() * 20 + 5).toFixed(1)}%`, 
      ram: `1.2GB / 8GB`, 
      network: `45.2 Mbps`, 
      history 
    });
  });

  // System Status
  apiRouter.get('/system/status', async (req, res) => {
    try {
      const usersCount = 5420;
      const servicesCount = 1250;
      const activeServicesCount = 1180;
      const ticketsCount = 12;
      
      const history = Array.from({ length: 10 }, (_, i) => ({
        name: `${i * 2}:00`,
        bandwidth: Math.floor(servicesCount * 0.005 + Math.random() * 5 + 10),
        cpu: Math.floor(Math.random() * 20 + 30)
      }));

      res.json({ 
        uptime: '99.99%', 
        load: (servicesCount * 0.0001 + 0.5).toFixed(2), 
        globalTraffic: (servicesCount * 0.005 + 5).toFixed(1) + ' Gbps', 
        activeUsers: usersCount,
        activeServices: activeServicesCount,
        openTickets: ticketsCount,
        cpuLoad: Math.floor(Math.random() * 15 + 35),
        ramLoad: Math.floor(Math.random() * 10 + 60),
        networkStatus: 'Optimal',
        supportStatus: '24/7 Available',
        history
      });
    } catch (error) {
      console.error('System status endpoint error:', error);
      res.status(500).json({ error: 'Failed to fetch system status' });
    }
  });

  // External Links API
  apiRouter.get('/links', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('external_links')
        .select('*');
      
      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching links from Supabase:', error);
      res.status(500).json({ error: 'Failed to fetch links', details: error.message });
    }
  });

  apiRouter.get('/links/:slug', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('external_links')
        .select('*')
        .eq('slug', req.params.slug)
        .single();

      if (error || !data) {
        const fallbacks: Record<string, string> = {
          'client_login': 'https://billing.jannatit.com/clientarea.php',
          'order_now': 'https://billing.jannatit.com/cart.php?a=add&pid=1',
          'vps_order': 'https://billing.jannatit.com/cart.php?gid=1',
          'rdp_order': 'https://billing.jannatit.com/cart.php?gid=2',
          'hosting_order': 'https://billing.jannatit.com/cart.php?gid=3'
        };
        const url = fallbacks[req.params.slug] || 'https://billing.jannatit.com';
        return res.json({ url });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch link' });
    }
  });

  apiRouter.post('/links', async (req, res) => {
    const { name, slug, url } = req.body;
    try {
      const { data, error } = await supabase
        .from('external_links')
        .upsert({ name, slug, url, updated_at: new Date().toISOString() }, { onConflict: 'slug' });
      
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error('Error saving link to Supabase:', error);
      res.status(500).json({ error: 'Failed to save link' });
    }
  });

  // Settings API
  apiRouter.get('/settings', async (req, res) => {
    const settings = await getGlobalSettings();
    res.json(settings);
  });

  apiRouter.post('/settings', async (req, res) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 'global', value: req.body, updated_at: new Date().toISOString() });
      
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error('Error saving settings to Supabase:', error);
      res.status(500).json({ error: 'Failed to save settings' });
    }
  });

  // Mount API Router
  app.use('/api', apiRouter);

  // Vite
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith('/api/')) return res.status(404).json({ error: 'API Route Not Found' });
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) { vite.ssrFixStacktrace(e as Error); next(e); }
  });

  const port = parseInt(process.env.PORT || '3000');
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
  });
}

startServer();

<?php
/**
 * Template Name: Client Dashboard
 */

if ( ! is_user_logged_in() ) {
    auth_redirect();
}

$current_user = wp_get_current_user();
$email = $current_user->user_email;

// Fetch Client ID from WHMCS using email
$client_data = jannat_it_call_whmcs('GetClientsDetails', array('email' => $email));
$client_id = ($client_data['result'] === 'success') ? $client_data['client']['id'] : null;

$invoices = array();
if ($client_id) {
    $invoice_data = jannat_it_call_whmcs('GetInvoices', array('userid' => $client_id, 'limitnum' => 5));
    if ($invoice_data['result'] === 'success' && isset($invoice_data['invoices']['invoice'])) {
        $invoices = $invoice_data['invoices']['invoice'];
    }
}

get_header(); ?>

<main class="min-h-screen py-12">
    <div class="container mx-auto px-6">
        <!-- Dashboard Header -->
        <header class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 class="text-4xl font-black text-white tracking-tighter mb-2">Welcome, <?php echo esc_html($current_user->display_name); ?></h1>
                <p class="text-slate-500 font-medium italic">Manage your services and invoices from one central place.</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="px-6 py-3 glass-card rounded-2xl border-white/10 flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-xs font-bold text-white uppercase tracking-widest">System Online</span>
                </div>
                <a href="<?php echo wp_logout_url(home_url()); ?>" class="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-600/20">
                    <i data-lucide="log-out" class="w-5 h-5"></i>
                </a>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column: Services & Stats -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Quick Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="p-6 glass-card rounded-3xl border-white/5 group hover:border-orange-500/30 transition-all">
                        <div class="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                            <i data-lucide="server" class="w-6 h-6"></i>
                        </div>
                        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Services</div>
                        <div class="text-3xl font-black text-white">0</div>
                    </div>
                    <div class="p-6 glass-card rounded-3xl border-white/5 group hover:border-emerald-500/30 transition-all">
                        <div class="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                            <i data-lucide="credit-card" class="w-6 h-6"></i>
                        </div>
                        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Unpaid Invoices</div>
                        <div class="text-3xl font-black text-white"><?php echo count($invoices); ?></div>
                    </div>
                    <div class="p-6 glass-card rounded-3xl border-white/5 group hover:border-blue-500/30 transition-all">
                        <div class="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                            <i data-lucide="life-buoy" class="w-6 h-6"></i>
                        </div>
                        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Support Tickets</div>
                        <div class="text-3xl font-black text-white">0</div>
                    </div>
                </div>

                <!-- Active Services Table -->
                <section class="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                    <div class="p-8 border-b border-white/5 flex items-center justify-between">
                        <h2 class="text-xl font-bold text-white tracking-tight">Active Services</h2>
                        <a href="<?php echo esc_url(home_url('/plans')); ?>" class="text-xs font-bold text-orange-500 uppercase tracking-widest hover:underline">Deploy New</a>
                    </div>
                    <div class="p-8 text-center py-20">
                        <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i data-lucide="box" class="w-10 h-10 text-slate-700"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2">No active services found</h3>
                        <p class="text-slate-500 text-sm max-w-xs mx-auto mb-8">You don't have any active VPS or RDP instances yet. Start by choosing a plan.</p>
                        <a href="<?php echo esc_url(home_url('/plans')); ?>" class="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20">
                            Get Started
                            <i data-lucide="chevron-right" class="w-4 h-4"></i>
                        </a>
                    </div>
                </section>
            </div>

            <!-- Right Column: Invoices & Profile -->
            <div class="space-y-8">
                <!-- Recent Invoices -->
                <section class="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                    <div class="p-8 border-b border-white/5">
                        <h2 class="text-xl font-bold text-white tracking-tight">Recent Invoices</h2>
                    </div>
                    <div class="divide-y divide-white/5">
                        <?php if (empty($invoices)) : ?>
                            <div class="p-8 text-center text-slate-500 text-sm italic">
                                No invoices found.
                            </div>
                        <?php else : ?>
                            <?php foreach ($invoices as $invoice) : ?>
                                <div class="p-6 hover:bg-white/[0.02] transition-colors">
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <div class="text-sm font-bold text-white">Invoice #<?php echo esc_html($invoice['id']); ?></div>
                                            <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest"><?php echo esc_html($invoice['date']); ?></div>
                                        </div>
                                        <div class="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest <?php echo $invoice['status'] === 'Unpaid' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'; ?>">
                                            <?php echo esc_html($invoice['status']); ?>
                                        </div>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <div class="text-lg font-bold text-white"><?php echo esc_html($invoice['currencycode']); ?> <?php echo esc_html($invoice['total']); ?></div>
                                        <?php if ($invoice['status'] === 'Unpaid') : ?>
                                            <a href="<?php echo esc_url(get_option('jannat_it_whmcs_url') . '/viewinvoice.php?id=' . $invoice['id']); ?>" target="_blank" class="text-xs font-bold text-orange-500 hover:underline">Pay Now</a>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </section>

                <!-- Profile Summary -->
                <section class="glass-card rounded-[2.5rem] border-white/5 p-8">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-orange-600/20">
                            <?php echo strtoupper(substr($current_user->display_name, 0, 1)); ?>
                        </div>
                        <div>
                            <div class="text-lg font-bold text-white"><?php echo esc_html($current_user->display_name); ?></div>
                            <div class="text-xs text-slate-500 font-medium"><?php echo esc_html($current_user->user_email); ?></div>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <a href="<?php echo esc_url(get_option('jannat_it_whmcs_url') . '/clientarea.php?action=details'); ?>" target="_blank" class="w-full py-4 glass-card border-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold text-white uppercase tracking-widest transition-all">
                            <i data-lucide="user" class="w-4 h-4"></i>
                            Edit Profile
                        </a>
                        <a href="<?php echo esc_url(get_option('jannat_it_whmcs_url') . '/submitticket.php'); ?>" target="_blank" class="w-full py-4 glass-card border-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold text-white uppercase tracking-widest transition-all">
                            <i data-lucide="life-buoy" class="w-4 h-4"></i>
                            Support Center
                        </a>
                    </div>
                </section>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>

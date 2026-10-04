<?php get_header(); ?>

<?php
// Fetch Plans from CPT
$plans_query = new WP_Query(array(
    'post_type' => 'hosting_plan',
    'posts_per_page' => 3,
    'orderby' => 'menu_order',
    'order' => 'ASC'
));

$plans = array();
if ($plans_query->have_posts()) {
    while ($plans_query->have_posts()) {
        $plans_query->the_post();
        $id = get_the_ID();
        $plans[] = array(
            'id' => $id,
            'name' => get_the_title(),
            'monthly_price' => get_post_meta($id, '_plan_monthly_price', true),
            'yearly_price' => get_post_meta($id, '_plan_yearly_price', true),
            'pid' => get_post_meta($id, '_plan_whmcs_pid', true),
            'recommended' => get_post_meta($id, '_plan_is_recommended', true) === '1',
            'color' => get_post_meta($id, '_plan_color', true) ?: 'blue',
            'specs' => explode("\n", get_post_meta($id, '_plan_features', true)),
            'comp' => array(
                'cpu' => get_post_meta($id, '_plan_spec_cpu', true) ?: '-',
                'ram' => get_post_meta($id, '_plan_spec_ram', true) ?: '-',
                'storage' => get_post_meta($id, '_plan_spec_storage', true) ?: '-',
                'port' => get_post_meta($id, '_plan_spec_port', true) ?: '-',
                'ip' => get_post_meta($id, '_plan_spec_ip', true) ?: '-',
                'os' => get_post_meta($id, '_plan_spec_os', true) ?: '-',
            )
        );
    }
    wp_reset_postdata();
}

$features = [
    [
        'title' => '99.9% Uptime Guarantee',
        'description' => 'Our enterprise-grade infrastructure ensures your services remain online 24/7 without interruption.',
        'icon' => 'clock'
    ],
    [
        'title' => 'Instant Provisioning',
        'description' => 'Your VPS or RDP instance is deployed automatically within minutes of your successful payment.',
        'icon' => 'zap'
    ],
    [
        'title' => 'Global Data Centers',
        'description' => 'Strategically located servers across the US, Europe, and Asia for low-latency performance.',
        'icon' => 'globe'
    ],
    [
        'title' => 'DDoS Protection',
        'description' => 'All plans include advanced layer 7 DDoS mitigation to keep your data safe from malicious attacks.',
        'icon' => 'shield'
    ]
];
?>

<main>
    <!-- Hero Section -->
    <section class="relative pt-20 pb-32 overflow-hidden bg-[#0A0A0B]">
        <!-- Background Decorative Gradient -->
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,77,0,0.05)_0%,_transparent_70%)]"></div>
        </div>

        <div class="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <!-- Trust Badges -->
            <div class="flex flex-wrap justify-center items-center gap-4 mb-16">
                <div class="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md">
                    <div class="flex text-yellow-500">
                        <span class="text-sm">★</span>
                    </div>
                    <span class="text-xs font-bold text-white">4.8/5</span>
                    <span class="text-[10px] text-slate-500 font-medium">on HostAdvice</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md">
                    <div class="flex text-yellow-500">
                        <span class="text-sm">★</span>
                    </div>
                    <span class="text-xs font-bold text-white">3.8/5</span>
                    <span class="text-[10px] text-slate-500 font-medium">on Trustpilot</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md">
                    <i data-lucide="shield" class="w-3 h-3 text-blue-400"></i>
                    <span class="text-xs font-bold text-white">7-day</span>
                    <span class="text-[10px] text-slate-500 font-medium">money-back guarantee</span>
                </div>
            </div>

            <div class="animate-fade-up">
                <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight leading-[1.1]">
                    Fast Windows RDP & <br /> VPS
                </h1>
                
                <div class="text-4xl md:text-5xl lg:text-6xl font-black text-[#FF4D00] mb-8">
                    from $6.99/month
                </div>

                <p class="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-medium">
                    jannatit.net delivers high-performance Windows RDP, Linux VPS, and business email hosting from 16 data centers worldwide — with full admin access and 24/7 support.
                </p>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <a href="#pricing" class="w-full sm:w-auto px-10 py-4 bg-[#FF4D00] hover:bg-[#FF6A00] text-white font-bold rounded-xl transition-all shadow-xl shadow-orange-600/20 text-lg">
                        See Plans & Pricing
                    </a>
                    <button onclick="Tawk_API.toggle()" class="w-full sm:w-auto px-10 py-4 border border-white/10 hover:bg-white/5 text-white font-bold rounded-xl transition-all text-lg">
                        Chat With Sales
                    </button>
                </div>

                <!-- Bottom Features -->
                <div class="flex flex-wrap justify-center items-center gap-8 text-sm font-bold text-slate-300">
                    <div class="flex items-center gap-2">
                        <i data-lucide="check" class="w-4 h-4 text-emerald-500"></i>
                        No setup fee
                    </div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="check" class="w-4 h-4 text-emerald-500" />
                        99.9% uptime SLA
                    </div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="check" class="w-4 h-4 text-emerald-500" />
                        Instant provisioning
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-32 relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[160px] pointer-events-none"></div>
        
        <div class="max-w-7xl mx-auto px-6 relative">
            <div class="text-center mb-20">
                <h2 class="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tighter">Choose Your Power</h2>
                <p class="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
                    Scalable infrastructure tailored to your needs. From <span class="text-orange-500 font-bold">SSD VPS</span> to high-performance <span class="text-orange-500 font-bold">NVMe Dedicated</span> resources.
                </p>

                <!-- Pricing Toggle -->
                <div class="flex items-center justify-center gap-4">
                    <span class="text-sm font-bold text-slate-400 uppercase tracking-widest" id="monthly-label">Monthly</span>
                    <button id="billing-toggle" class="w-16 h-8 rounded-full bg-white/5 border border-white/10 relative p-1 transition-all">
                        <div id="toggle-circle" class="w-6 h-6 bg-orange-600 rounded-full shadow-lg shadow-orange-600/40 transition-all transform translate-x-0"></div>
                    </button>
                    <span class="text-sm font-bold text-slate-500 uppercase tracking-widest" id="yearly-label">Yearly <span class="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full ml-1">Save 20%</span></span>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <?php foreach ($plans as $plan) : ?>
                    <div class="relative p-10 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] <?php echo $plan['recommended'] ? 'border-orange-500/50 bg-gradient-to-b from-orange-600/[0.08] to-transparent glow-orange-strong' : 'glass-card border-white/5 hover:border-white/20'; ?> group">
                        <?php if ($plan['recommended']) : ?>
                            <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-orange-600 text-[10px] font-black text-white rounded-full uppercase tracking-[0.2em] shadow-xl shadow-orange-600/40">
                                Most Popular
                            </div>
                        <?php endif; ?>

                        <div class="flex justify-between items-start mb-8">
                            <div>
                                <h3 class="text-2xl font-black text-white tracking-tight"><?php echo esc_html($plan['name']); ?></h3>
                                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Enterprise Grade</div>
                            </div>
                            <div class="w-12 h-12 rounded-2xl flex items-center justify-center <?php 
                                echo $plan['color'] === 'orange' ? 'bg-orange-600/20 text-orange-500' :
                                    ($plan['color'] === 'blue' ? 'bg-blue-600/20 text-blue-500' : 'bg-purple-600/20 text-purple-500'); 
                            ?>">
                                <i data-lucide="zap" class="w-6 h-6"></i>
                            </div>
                        </div>

                        <div class="flex items-baseline gap-1 mb-10">
                            <span class="text-5xl font-black text-white tracking-tighter">$<span class="plan-price" data-monthly="<?php echo esc_attr($plan['monthly_price']); ?>" data-yearly="<?php echo esc_attr($plan['yearly_price']); ?>"><?php echo esc_html($plan['monthly_price']); ?></span></span>
                            <span class="text-slate-500 font-bold text-sm billing-cycle">/month</span>
                        </div>

                        <div class="space-y-4 mb-12">
                            <?php foreach ($plan['specs'] as $spec) : ?>
                                <?php if (!empty(trim($spec))) : ?>
                                    <div class="flex items-center gap-3 text-slate-300 group/item">
                                        <div class="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/item:border-orange-500/50 transition-colors">
                                            <i data-lucide="check" class="w-3 h-3 text-orange-500"></i>
                                        </div>
                                        <span class="text-sm font-medium"><?php echo esc_html(trim($spec)); ?></span>
                                    </div>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>

                        <a href="<?php echo esc_url( home_url('/configure/' . $plan['pid']) ); ?>" class="w-full py-4 rounded-2xl font-black transition-all text-center block uppercase tracking-widest text-xs <?php 
                            echo $plan['recommended'] ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-600/30' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'; 
                        ?>">
                            Deploy Instance
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- Comparison Table -->
            <div class="mt-32 overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead>
                        <tr class="border-b border-white/10 text-left">
                            <th class="py-6 px-4 text-sm font-black text-slate-500 uppercase tracking-widest">Core Features</th>
                            <?php foreach ($plans as $plan) : ?>
                            <th class="py-6 px-4 text-lg font-black <?php echo $plan['recommended'] ? 'text-[#FF4D00]' : 'text-white'; ?>">
                                <?php echo esc_html($plan['name']); ?>
                            </th>
                            <?php endforeach; ?>
                        </tr>
                    </thead>
                    <tbody class="text-slate-300">
                        <?php
                        $features_map = [
                            'cpu' => 'CPU Cores',
                            'ram' => 'Memory (RAM)',
                            'storage' => 'Storage',
                            'port' => 'Network Port',
                            'ip' => 'IP Addresses',
                            'os' => 'OS Support',
                        ];
                        foreach ($features_map as $key => $label) :
                        ?>
                        <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td class="py-5 px-4 font-bold text-sm"><?php echo $label; ?></td>
                            <?php foreach ($plans as $plan) : ?>
                            <td class="py-5 px-4 text-sm <?php echo $plan['recommended'] ? 'font-bold text-white group-hover:text-[#FF4D00]' : ''; ?> transition-colors">
                                <?php echo esc_html($plan['comp'][$key]); ?>
                            </td>
                            <?php endforeach; ?>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-32 bg-[#0A0A0B] relative overflow-hidden">
        <div class="max-w-4xl mx-auto px-6 relative z-10">
            <div class="text-center mb-20">
                <h2 class="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tighter">Frequently Asked Questions</h2>
                <p class="text-slate-400 text-lg">Got questions? We've got answers about our premium cloud services.</p>
            </div>

            <div class="space-y-4">
                <?php
                $faqs = [
                    [
                        'q' => 'How fast is the server setup?',
                        'a' => 'Our instant provisioning system deploys your VPS or RDP instance within 60 seconds of successful payment. Dedicated servers typically take 1-4 hours depending on customization.'
                    ],
                    [
                        'q' => 'Which payment methods do you accept?',
                        'a' => 'We accept PayPal, Credit/Debit Cards (Stripe), Bitcoin (BTC), Ethereum (ETH), and local methods like bKash, Rocket, and Nagad.'
                    ],
                    [
                        'q' => 'Can I upgrade my plan later?',
                        'a' => 'Yes, you can upgrade your RAM, CPU, or Storage at any time directly from your client dashboard. The changes are applied instantly without data loss.'
                    ],
                    [
                        'q' => 'Do you offer a money-back guarantee?',
                        'a' => 'Yes, we provide a 7-day money-back guarantee if you are not satisfied with our service quality. No questions asked.'
                    ],
                    [
                        'q' => 'Is my data safe with Jannat IT?',
                        'a' => 'Absolutely. We use RAID 10 storage for data redundancy and perform weekly off-site backups for all VPS and RDP plans.'
                    ]
                ];
                foreach ($faqs as $i => $faq) :
                ?>
                <div class="faq-item rounded-2xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all duration-300">
                    <button class="faq-toggle w-full py-6 px-8 flex items-center justify-between gap-4 text-left">
                        <span class="text-lg font-bold text-white"><?php echo $faq['q']; ?></span>
                        <div class="faq-icon w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300">
                            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-500"></i>
                        </div>
                    </button>
                    <div class="faq-content hidden overflow-hidden">
                        <div class="px-8 pb-6 text-slate-400 leading-relaxed">
                            <?php echo $faq['a']; ?>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // FAQ Functionality
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const toggle = item.querySelector('.faq-toggle');
                const content = item.querySelector('.faq-content');
                const icon = item.querySelector('.faq-icon');
                const lucideIcon = icon.querySelector('i');

                toggle.addEventListener('click', () => {
                    const isOpen = !content.classList.contains('hidden');
                    
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.querySelector('.faq-content').classList.add('hidden');
                            otherItem.querySelector('.faq-icon').classList.remove('rotate-180', 'border-orange-500/30');
                            if (otherItem.querySelector('.faq-icon i')) {
                                otherItem.querySelector('.faq-icon i').classList.replace('text-orange-500', 'text-slate-500');
                            }
                            otherItem.classList.remove('bg-white/[0.03]', 'border-orange-500/30');
                        }
                    });

                    if (isOpen) {
                        content.classList.add('hidden');
                        icon.classList.remove('rotate-180', 'border-orange-500/30');
                        if (lucideIcon) lucideIcon.classList.replace('text-orange-500', 'text-slate-500');
                        item.classList.remove('bg-white/[0.03]', 'border-orange-500/30');
                    } else {
                        content.classList.remove('hidden');
                        icon.classList.add('rotate-180', 'border-orange-500/30');
                        if (lucideIcon) lucideIcon.classList.replace('text-slate-500', 'text-orange-500');
                        item.classList.add('bg-white/[0.03]', 'border-orange-500/30');
                    }
                });
            });

            // Billing Toggle Functionality
            const billingToggle = document.getElementById('billing-toggle');
            if (billingToggle) {
                const circle = document.getElementById('toggle-circle');
                const prices = document.querySelectorAll('.plan-price');
                const cycles = document.querySelectorAll('.billing-cycle');
                const monthlyLabel = document.getElementById('monthly-label');
                const yearlyLabel = document.getElementById('yearly-label');
                
                let isYearly = false;

                billingToggle.addEventListener('click', () => {
                    isYearly = !isYearly;
                    
                    if (isYearly) {
                        circle.style.transform = 'translateX(2rem)';
                        monthlyLabel.classList.replace('text-slate-400', 'text-slate-500');
                        yearlyLabel.classList.replace('text-slate-500', 'text-slate-400');
                        
                        prices.forEach(p => {
                            p.textContent = p.dataset.yearly;
                        });
                        cycles.forEach(c => c.textContent = '/year');
                    } else {
                        circle.style.transform = 'translateX(0)';
                        monthlyLabel.classList.replace('text-slate-500', 'text-slate-400');
                        yearlyLabel.classList.replace('text-slate-400', 'text-slate-500');
                        
                        prices.forEach(p => {
                            p.textContent = p.dataset.monthly;
                        });
                        cycles.forEach(c => c.textContent = '/month');
                    }
                });
            }
        });
    </script>

    <!-- Features Grid -->
    <section class="py-32 bg-[#050506]">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <?php foreach ($features as $feature) : ?>
                    <div class="p-8 rounded-3xl glass-card border-white/5 hover:border-orange-500/30 transition-all group">
                        <div class="w-14 h-14 rounded-2xl bg-orange-600/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            <i data-lucide="<?php echo esc_attr($feature['icon']); ?>" class="w-7 h-7 text-orange-500"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-glow transition-all"><?php echo esc_html($feature['title']); ?></h3>
                        <p class="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                            <?php echo esc_html($feature['description']); ?>
                        </p>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Hardware Bento Grid -->
    <section class="py-24 bg-[#0A0A0B] relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 relative z-10">
            <div class="text-center mb-16">
                <h2 class="text-sm font-black text-[#FF4D00] uppercase tracking-[0.3em] mb-4">The Infrastructure</h2>
                <p class="text-4xl md:text-5xl font-black text-white tracking-tight">Enterprise Grade Backbone</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <!-- CPU - Large Bento -->
                <div class="md:col-span-4 lg:col-span-4 p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 flex flex-col justify-between group overflow-hidden relative">
                    <div class="relative z-10">
                        <div class="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6 border border-orange-500/20">
                            <i data-lucide="cpu" class="w-6 h-6 text-[#FF4D00]"></i>
                        </div>
                        <h3 class="text-2xl font-black text-white mb-4">AMD EPYC™ 7003 Processors</h3>
                        <p class="text-slate-400 max-w-md text-sm leading-relaxed mb-6">
                            Experience unmatched multi-threaded performance with the latest Milan architecture. High clock speeds and massive L3 cache for demanding workloads.
                        </p>
                        <div class="flex gap-4">
                            <div class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">3.5GHz Turbo</div>
                            <div class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">Milan Architecture</div>
                        </div>
                    </div>
                    <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-[#FF4D00]/10 rounded-full blur-[100px] group-hover:bg-[#FF4D00]/20 transition-all duration-700"></div>
                    <div class="absolute right-12 bottom-12 opacity-5 group-hover:opacity-10 transition-opacity">
                        <i data-lucide="cpu" class="w-48 h-48 text-white"></i>
                    </div>
                </div>

                <!-- RAM -->
                <div class="md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-white/5 group relative overflow-hidden">
                    <div class="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/10">
                        <i data-lucide="zap" class="w-5 h-5 text-blue-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">DDR4 ECC RAM</h3>
                    <p class="text-slate-500 text-xs leading-relaxed">
                        Error-Correcting Code memory for maximum stability and data integrity.
                    </p>
                    <div class="mt-8 pt-8 border-t border-white/5">
                        <div class="text-2xl font-black text-white tracking-tighter">3200 MT/s</div>
                        <div class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Memory Speed</div>
                    </div>
                </div>

                <!-- Storage -->
                <div class="md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-white/5 group relative overflow-hidden">
                    <div class="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/10">
                        <i data-lucide="hard-drive" class="w-5 h-5 text-emerald-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Gen4 NVMe</h3>
                    <p class="text-slate-500 text-xs leading-relaxed">
                        Blazing fast I/O performance with Enterprise NVMe SSDs in RAID 10.
                    </p>
                    <div class="mt-8 flex items-end justify-between">
                        <div>
                            <div class="text-2xl font-black text-white tracking-tighter">7,500 MB/s</div>
                            <div class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Read Speed</div>
                        </div>
                        <div class="h-10 w-20 flex items-end gap-1 pb-1">
                            <div class="flex-1 bg-emerald-500/30 rounded-t-sm h-[40%]"></div>
                            <div class="flex-1 bg-emerald-500/30 rounded-t-sm h-[70%]"></div>
                            <div class="flex-1 bg-emerald-500/30 rounded-t-sm h-[45%]"></div>
                            <div class="flex-1 bg-emerald-500/30 rounded-t-sm h-[90%]"></div>
                            <div class="flex-1 bg-emerald-500/30 rounded-t-sm h-[65%]"></div>
                            <div class="flex-1 bg-emerald-500/30 rounded-t-sm h-[80%]"></div>
                        </div>
                    </div>
                </div>

                <!-- Network -->
                <div class="md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-white/5 group relative overflow-hidden">
                    <div class="w-10 h-10 bg-[#FF4D00]/10 rounded-xl flex items-center justify-center mb-6 border-[#FF4D00]/10">
                        <i data-lucide="globe" class="w-5 h-5 text-[#FF4D00]"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">10Gbps Uplink</h3>
                    <p class="text-slate-500 text-xs leading-relaxed">
                        Redundant fiber-optic backbone with multiple Tier 1 carriers.
                    </p>
                    <div class="mt-8 flex justify-center py-4">
                        <div class="relative">
                            <div class="w-16 h-16 rounded-full border-2 border-white/5 border-t-[#FF4D00] animate-spin"></div>
                            <div class="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">LOW</div>
                        </div>
                    </div>
                </div>

                <!-- Uptime -->
                <div class="md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-white/5 group relative overflow-hidden">
                    <div class="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center mb-6 border-purple-500/10">
                        <i data-lucide="clock" class="w-5 h-5 text-purple-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Tier 3+ DC</h3>
                    <p class="text-slate-500 text-xs leading-relaxed">
                        N+1 Redundant power and cooling in strategically located facilities.
                    </p>
                    <div class="mt-8 pt-8 border-t border-white/5">
                        <div class="text-3xl font-black text-emerald-500 tracking-tighter">99.99%</div>
                        <div class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Uptime Record</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-40 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-orange-600/5 to-transparent"></div>
        <div class="max-w-4xl mx-auto px-6 text-center relative">
            <div>
                <h2 class="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Ready to fire up <br /> your next project?</h2>
                <p class="text-xl text-slate-400 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
                    Join thousands of developers and businesses who trust <span class="text-orange-500 font-bold">Jannat IT</span> for their mission-critical infrastructure.
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a href="<?php echo esc_url( home_url('/vps') ); ?>" class="w-full sm:w-auto px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-slate-100 transition-all text-center uppercase tracking-widest text-xs shadow-2xl shadow-white/5">
                        Get Started Now
                    </a>
                    <button onclick="Tawk_API.toggle()" class="w-full sm:w-auto px-12 py-5 bg-white/5 text-white border border-white/10 font-black rounded-2xl hover:bg-white/10 transition-all text-center uppercase tracking-widest text-xs backdrop-blur-sm">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>

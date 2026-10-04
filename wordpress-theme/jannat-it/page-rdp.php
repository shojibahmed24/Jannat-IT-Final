<?php
/**
 * Template Name: RDP Server Page
 */

get_header(); ?>

<main>
    <!-- Hero Section -->
    <section class="relative py-24 lg:py-32 overflow-hidden bg-mesh">
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute inset-0 hero-grid opacity-20"></div>
        </div>
        <div class="max-w-7xl mx-auto px-6 relative text-center">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-500/20 text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-8">
                High-Speed Remote Desktop
            </div>
            <h1 class="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Premium RDP Servers</h1>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                Experience ultra-low latency RDP servers with 10Gbps uplink. Perfect for high-demand tasks.
            </p>

            <!-- Pricing Toggle -->
            <div class="flex items-center justify-center gap-4">
                <span class="text-sm font-bold text-slate-400 uppercase tracking-widest" id="rdp-monthly-label">Monthly</span>
                <button id="rdp-billing-toggle" class="w-16 h-8 rounded-full bg-white/5 border border-white/10 relative p-1 transition-all">
                    <div id="rdp-toggle-circle" class="w-6 h-6 bg-orange-600 rounded-full shadow-lg shadow-orange-600/40 transition-all transform translate-x-0"></div>
                </button>
                <span class="text-sm font-bold text-slate-500 uppercase tracking-widest" id="rdp-yearly-label">Yearly <span class="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full ml-1">Save 20%</span></span>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-32 relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <?php
                $args = array(
                    'post_type' => 'hosting_plan',
                    'posts_per_page' => -1,
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'plan_category',
                            'field'    => 'slug',
                            'terms'    => 'rdp',
                        ),
                    ),
                );
                $query = new WP_Query($args);

                if ($query->have_posts()) :
                    while ($query->have_posts()) : $query->the_post();
                        $id = get_the_ID();
                        $monthly_price = get_post_meta($id, '_plan_monthly_price', true);
                        $yearly_price = get_post_meta($id, '_plan_yearly_price', true);
                        $pid = get_post_meta($id, '_plan_whmcs_pid', true);
                        $recommended = get_post_meta($id, '_plan_is_recommended', true) === '1';
                        $color = get_post_meta($id, '_plan_color', true) ?: 'orange';
                        $specs = explode("\n", get_post_meta($id, '_plan_features', true));
                ?>
                    <div class="relative p-10 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] <?php echo $recommended ? 'border-orange-500/50 bg-gradient-to-b from-orange-600/[0.08] to-transparent glow-orange-strong' : 'glass-card border-white/5 hover:border-white/20'; ?> group">
                        <?php if ($recommended) : ?>
                            <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-orange-600 text-[10px] font-black text-white rounded-full uppercase tracking-[0.2em] shadow-xl shadow-orange-600/40">
                                Best Value
                            </div>
                        <?php endif; ?>

                        <div class="flex justify-between items-start mb-8">
                            <h3 class="text-2xl font-black text-white tracking-tight"><?php the_title(); ?></h3>
                            <div class="w-12 h-12 rounded-2xl flex items-center justify-center <?php 
                                echo $color === 'orange' ? 'bg-orange-600/20 text-orange-500' :
                                    ($color === 'blue' ? 'bg-blue-600/20 text-blue-500' : 'bg-purple-600/20 text-purple-500'); 
                            ?>">
                                <i data-lucide="monitor" class="w-6 h-6"></i>
                            </div>
                        </div>

                        <div class="flex items-baseline gap-1 mb-10">
                            <span class="text-5xl font-black text-white tracking-tighter">$<span class="rdp-price" data-monthly="<?php echo esc_attr($monthly_price); ?>" data-yearly="<?php echo esc_attr($yearly_price); ?>"><?php echo esc_html($monthly_price); ?></span></span>
                            <span class="text-slate-500 font-bold text-sm rdp-cycle">/mo</span>
                        </div>

                        <div class="space-y-4 mb-12">
                            <?php foreach ($specs as $spec) : ?>
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

                        <a href="<?php echo esc_url( home_url('/configure/' . $pid) ); ?>" class="w-full py-4 rounded-2xl font-black transition-all text-center block uppercase tracking-widest text-xs <?php 
                            echo $recommended ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-600/30' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'; 
                        ?>">
                            Deploy Now
                        </a>
                    </div>
                <?php
                    endwhile;
                    wp_reset_postdata();
                else:
                ?>
                    <div class="col-span-3 text-center py-20 glass-card rounded-[2.5rem]">
                        <p class="text-slate-500">No RDP plans found. Please add plans in category 'rdp'.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const toggle = document.getElementById('rdp-billing-toggle');
            const circle = document.getElementById('rdp-toggle-circle');
            const prices = document.querySelectorAll('.rdp-price');
            const cycles = document.querySelectorAll('.rdp-cycle');
            const monthlyLabel = document.getElementById('rdp-monthly-label');
            const yearlyLabel = document.getElementById('rdp-yearly-label');
            
            let isYearly = false;

            toggle.addEventListener('click', () => {
                isYearly = !isYearly;
                
                if (isYearly) {
                    circle.style.transform = 'translateX(2rem)';
                    monthlyLabel.classList.replace('text-slate-400', 'text-slate-500');
                    yearlyLabel.classList.replace('text-slate-500', 'text-slate-400');
                    
                    prices.forEach(p => {
                        p.textContent = p.dataset.yearly;
                    });
                    cycles.forEach(c => c.textContent = '/yr');
                } else {
                    circle.style.transform = 'translateX(0)';
                    monthlyLabel.classList.replace('text-slate-500', 'text-slate-400');
                    yearlyLabel.classList.replace('text-slate-400', 'text-slate-500');
                    
                    prices.forEach(p => {
                        p.textContent = p.dataset.monthly;
                    });
                    cycles.forEach(c => c.textContent = '/mo');
                }
            });
        });
    </script>
</main>

<?php get_footer(); ?>

<?php
/**
 * Template Name: VPS Hosting Page
 */

get_header(); ?>

<main>
    <!-- Hero Section -->
    <section class="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-mesh">
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute inset-0 hero-grid opacity-20"></div>
        </div>
        <div class="max-w-7xl mx-auto px-6 relative text-center">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-500/20 text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-8" data-aos="fade-down">
                Enterprise Cloud VPS
            </div>
            <h1 class="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter" data-aos="fade-up">High Performance <br class="hidden md:block" /> VPS Hosting</h1>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-10" data-aos="fade-up" data-aos-delay="100">
                <?php the_content() ?: print("Deploy your next project on our lightning-fast NVMe VPS infrastructure. Scalable, secure, and reliable."); ?>
            </p>

            <!-- Pricing Toggle -->
            <div class="flex items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
                <span class="text-sm font-bold text-slate-400 uppercase tracking-widest" id="vps-monthly-label">Monthly</span>
                <button id="vps-billing-toggle" class="w-16 h-8 rounded-full bg-white/5 border border-white/10 relative p-1 transition-all">
                    <div id="vps-toggle-circle" class="w-6 h-6 bg-orange-600 rounded-full shadow-lg shadow-orange-600/40 transition-all transform translate-x-0"></div>
                </button>
                <span class="text-sm font-bold text-slate-500 uppercase tracking-widest" id="vps-yearly-label">Yearly <span class="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full ml-1">Save 20%</span></span>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-16 md:py-32 relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php
                $args = array(
                    'post_type' => 'hosting_plan',
                    'posts_per_page' => -1,
                    'orderby' => 'menu_order',
                    'order' => 'ASC',
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'plan_category',
                            'field'    => 'slug',
                            'terms'    => 'vps',
                        ),
                    ),
                );
                $query = new WP_Query($args);
                $delay = 0;

                if ($query->have_posts()) :
                    while ($query->have_posts()) : $query->the_post();
                        $id = get_the_ID();
                        $monthly_price = get_post_meta($id, '_plan_monthly_price', true);
                        $yearly_price = get_post_meta($id, '_plan_yearly_price', true);
                        $pid = get_post_meta($id, '_plan_whmcs_pid', true);
                        $recommended = get_post_meta($id, '_plan_is_recommended', true) === '1';
                        $color = get_post_meta($id, '_plan_color', true) ?: 'blue';
                        $specs = explode("\n", get_post_meta($id, '_plan_features', true));
                ?>
                    <div class="relative p-10 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] <?php echo $recommended ? 'border-orange-500/50 bg-gradient-to-b from-orange-600/[0.08] to-transparent glow-orange-strong' : 'glass-card border-white/5 hover:border-white/20'; ?> group" data-aos="fade-up" data-aos-delay="<?php echo $delay; ?>">
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
                                <i data-lucide="zap" class="w-6 h-6"></i>
                            </div>
                        </div>

                        <div class="flex items-baseline gap-1 mb-10">
                            <span class="text-5xl font-black text-white tracking-tighter">$<span class="vps-price" data-monthly="<?php echo esc_attr($monthly_price); ?>" data-yearly="<?php echo esc_attr($yearly_price); ?>"><?php echo esc_html($monthly_price); ?></span></span>
                            <span class="text-slate-500 font-bold text-sm vps-cycle">/mo</span>
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

                        <a href="<?php echo esc_url( home_url('/configure/' . $pid) ); ?>" class="w-full py-4 rounded-2xl font-black transition-all text-center block uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 <?php 
                            echo $recommended ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-600/30 hover:shadow-orange-500/50' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'; 
                        ?>">
                            Deploy Now
                        </a>
                    </div>
                <?php
                        $delay += 100;
                    endwhile;
                    wp_reset_postdata();
                else:
                ?>
                    <div class="col-span-3 text-center py-20 glass-card rounded-[2.5rem]">
                        <p class="text-slate-500">No VPS plans found. Please add plans in category 'vps'.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const toggle = document.getElementById('vps-billing-toggle');
            const circle = document.getElementById('vps-toggle-circle');
            const prices = document.querySelectorAll('.vps-price');
            const cycles = document.querySelectorAll('.vps-cycle');
            const monthlyLabel = document.getElementById('vps-monthly-label');
            const yearlyLabel = document.getElementById('vps-yearly-label');
            
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

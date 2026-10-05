</div> <!-- End of content spacer -->

<footer class="bg-[#070708] border-t border-white/5 pt-20 pb-10">
    <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div class="space-y-6">
                <div class="flex items-center gap-2">
                    <?php 
                    $logo = get_theme_mod( 'jannat_it_logo' );
                    if ( $logo ) : ?>
                        <img src="<?php echo esc_url( $logo ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="h-8 w-auto">
                    <?php else : ?>
                        <div class="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                            <i data-lucide="zap" class="w-5 h-5 text-white fill-white"></i>
                        </div>
                    <?php endif; ?>
                    <span class="text-xl font-bold text-white"><?php echo get_theme_mod( 'jannat_it_brand_name', 'Jannat IT' ); ?></span>
                </div>
                <p class="text-sm leading-relaxed text-slate-500">
                    High-performance cloud infrastructure for businesses that demand the best uptime and speed.
                </p>
                <div class="flex gap-4">
                    <?php
                    $social_icons = array(
                        'facebook' => 'facebook',
                        'twitter'  => 'twitter',
                        'linkedin' => 'linkedin',
                        'instagram' => 'instagram',
                        'youtube'   => 'youtube'
                    );
                    foreach ( $social_icons as $slug => $icon ) :
                        $url = get_theme_mod( "jannat_it_{$slug}_url" );
                        if ( $url ) : ?>
                            <a href="<?php echo esc_url( $url ); ?>" target="_blank" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-colors border border-white/5">
                                <i data-lucide="<?php echo $icon; ?>" class="w-5 h-5"></i>
                            </a>
                        <?php endif;
                    endforeach; ?>
                </div>
            </div>

            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-widest text-sm">Services</h4>
                <ul class="space-y-4 text-sm text-slate-500">
                    <li><a href="<?php echo esc_url( home_url( '/vps' ) ); ?>" class="hover:text-orange-500 transition-colors">VPS Hosting</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/rdp' ) ); ?>" class="hover:text-orange-500 transition-colors">Windows RDP</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/domain' ) ); ?>" class="hover:text-orange-500 transition-colors">Domain Search</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/locations' ) ); ?>" class="hover:text-orange-500 transition-colors">Global Locations</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/faq' ) ); ?>" class="hover:text-orange-500 transition-colors">Frequently Asked Questions</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/affiliates' ) ); ?>" class="hover:text-orange-500 transition-colors">Affiliate Program</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-widest text-sm">Support</h4>
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'footer-support',
                    'container'      => false,
                    'menu_class'     => 'space-y-4 text-sm text-slate-500',
                    'fallback_cb'    => '__return_false',
                    'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
                    'link_before'    => '<span class="hover:text-orange-500 transition-colors">',
                    'link_after'     => '</span>',
                ) );
                ?>
            </div>

            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-widest text-sm">Legal</h4>
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'footer-legal',
                    'container'      => false,
                    'menu_class'     => 'space-y-4 text-sm text-slate-500',
                    'fallback_cb'    => '__return_false',
                    'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
                    'link_before'    => '<span class="hover:text-orange-500 transition-colors">',
                    'link_after'     => '</span>',
                ) );
                ?>
            </div>
        </div>

        <div class="pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
            <p class="text-xs text-slate-600 font-bold uppercase tracking-widest">
                © <?php echo date('Y'); ?> Jannat IT Solutions. All Rights Reserved.
            </p>
            <div class="flex items-center gap-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" class="h-4 opacity-30 hover:opacity-100 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" class="h-4 opacity-30 hover:opacity-100 transition-opacity">
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6ac209a442308034c24f8c64/1k42vbbms';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->
</body>
</html>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    
    <!-- SEO & Social Media Meta Tags -->
    <?php
    if ( is_single() || is_page() ) {
        $desc = get_the_excerpt();
        if (!$desc) $desc = get_bloginfo('description');
        echo '<meta name="description" content="' . esc_attr( wp_trim_words( $desc, 30 ) ) . '" />';
    } else {
        echo '<meta name="description" content="' . esc_attr( get_bloginfo('description') ) . '" />';
    }
    ?>

    <!-- Open Graph -->
    <meta property="og:site_name" content="<?php bloginfo('name'); ?>">
    <meta property="og:title" content="<?php wp_title('|', true, 'right'); ?>">
    <meta property="og:type" content="<?php echo is_single() ? 'article' : 'website'; ?>">
    <meta property="og:url" content="<?php echo esc_url( get_permalink() ); ?>">
    <?php if ( has_post_thumbnail() ) : ?>
        <meta property="og:image" content="<?php echo esc_url( get_the_post_thumbnail_url(null, 'large') ); ?>">
    <?php endif; ?>

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php wp_title('|', true, 'right'); ?>">

    <?php wp_head(); ?>
    <style>
        body {
            background-color: #050506;
            color: #94a3b8;
        }
        .text-glow {
            text-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
        }
    </style>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Promo Banner -->
<div class="bg-gradient-to-r from-[#FF4D00] to-[#FF6A00] py-2 px-4 text-center relative z-[60]">
    <p class="text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2">
        <span role="img" aria-label="fire">🔥</span>
        <?php echo esc_html( get_theme_mod( 'jannat_it_promo_text', 'Limited-time offer — save up to 55% on annual VPS plans' ) ); ?>
    </p>
</div>

<header class="sticky top-0 z-50 transition-all duration-300 bg-[#0A0A0B] border-b border-white/5">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
        <!-- Zone 1: Brand -->
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-2 group">
            <?php 
            $logo = get_theme_mod( 'jannat_it_logo' );
            if ( $logo ) : ?>
                <img src="<?php echo esc_url( $logo ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="h-8 w-auto">
            <?php else : ?>
                <div class="w-8 h-8 bg-[#FF4D00] rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform">
                    <i data-lucide="zap" class="w-5 h-5 text-white fill-white"></i>
                </div>
            <?php endif; ?>
            <span class="text-xl font-bold tracking-tight text-white"><?php echo get_theme_mod( 'jannat_it_brand_name', get_bloginfo('name') ); ?></span>
        </a>

        <!-- Zone 2: Navigation -->
        <nav class="hidden lg:flex items-center gap-8">
            <a href="<?php echo esc_url( home_url( '/rdp' ) ); ?>" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Windows RDP</a>
            <a href="<?php echo esc_url( home_url( '/vps' ) ); ?>" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">VPS Hosting</a>
            <a href="<?php echo esc_url( home_url( '/domain' ) ); ?>" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Domain</a>
        </nav>

        <!-- Zone 3: Actions -->
        <div class="flex items-center gap-4">
            <a href="<?php echo esc_url( get_theme_mod( 'jannat_it_login_url', home_url( '/login' ) ) ); ?>" class="hidden sm:block text-sm font-bold border border-white/10 px-6 py-2.5 rounded-lg hover:bg-white/5 transition-all text-white">
                Client Login
            </a>
            <a href="<?php echo esc_url( get_theme_mod( 'jannat_it_order_url', '#pricing' ) ); ?>" class="px-6 py-2.5 bg-[#FF4D00] hover:bg-[#FF6A00] text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-orange-600/20 whitespace-nowrap">
                Order Now
            </a>
            <button class="lg:hidden p-2 text-slate-400 hover:text-white" id="mobile-menu-toggle">
                <i data-lucide="menu"></i>
            </button>
        </div>
    </div>
</header>

<!-- Mobile Menu Drawer -->
<div id="mobile-menu" class="fixed inset-0 z-[100] translate-x-full transition-transform duration-500 lg:hidden">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="mobile-menu-overlay"></div>
    <div class="absolute right-0 top-0 bottom-0 w-[300px] bg-[#0A0A0B] border-l border-white/5 p-8 flex flex-col">
        <div class="flex items-center justify-between mb-12">
            <span class="text-xl font-bold text-white">Menu</span>
            <button class="p-2 text-slate-400 hover:text-white" id="mobile-menu-close">
                <i data-lucide="x"></i>
            </button>
        </div>

        <nav class="flex-1">
            <ul class="flex flex-col gap-6">
                <li><a href="<?php echo esc_url( home_url( '/rdp' ) ); ?>" class="text-lg font-bold text-slate-300 hover:text-[#FF4D00] transition-colors">Windows RDP</a></li>
                <li><a href="<?php echo esc_url( home_url( '/vps' ) ); ?>" class="text-lg font-bold text-slate-300 hover:text-[#FF4D00] transition-colors">VPS Hosting</a></li>
                <li><a href="<?php echo esc_url( home_url( '/domain' ) ); ?>" class="text-lg font-bold text-slate-300 hover:text-[#FF4D00] transition-colors">Domain</a></li>
            </ul>
        </nav>

        <div class="mt-auto pt-8 border-t border-white/5 space-y-4">
            <a href="<?php echo esc_url( home_url( '/login' ) ); ?>" class="block w-full py-4 border border-white/10 text-center font-bold text-white rounded-xl">Client Login</a>
            <a href="<?php echo esc_url( home_url( '/vps' ) ); ?>" class="block w-full py-4 bg-[#FF4D00] text-center font-bold text-white rounded-xl">Order Now</a>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const close = document.getElementById('mobile-menu-close');
        const overlay = document.getElementById('mobile-menu-overlay');
        const menu = document.getElementById('mobile-menu');

        const openMenu = () => {
            menu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            menu.classList.add('translate-x-full');
            document.body.style.overflow = '';
        };

        if (toggle) toggle.addEventListener('click', openMenu);
        if (close) close.addEventListener('click', closeMenu);
        if (overlay) overlay.addEventListener('click', closeMenu);
    });
</script>

<div class=""> <!-- No spacer needed for sticky header with promo -->

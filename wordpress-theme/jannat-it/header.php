<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
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
        Limited-time offer — <a href="#pricing" class="underline underline-offset-2 hover:text-white/90">save up to 55% on annual VPS plans</a>
    </p>
</div>

<header class="sticky top-0 z-50 transition-all duration-300 bg-[#0A0A0B] border-b border-white/5">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
        <!-- Zone 1: Brand -->
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-2 group">
            <div class="w-8 h-8 bg-[#FF4D00] rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform">
                <i data-lucide="zap" class="w-5 h-5 text-white fill-white"></i>
            </div>
            <span class="text-xl font-bold tracking-tight text-white">jannatit.net</span>
        </a>

        <!-- Zone 2: Navigation -->
        <nav class="hidden lg:flex items-center gap-8">
            <a href="<?php echo esc_url( home_url( '/rdp' ) ); ?>" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Windows RDP</a>
            <a href="<?php echo esc_url( home_url( '/vps' ) ); ?>" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">VPS Hosting</a>
            <a href="<?php echo esc_url( home_url( '/about' ) ); ?>" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Locations</a>
            <a href="<?php echo esc_url( home_url( '/about' ) ); ?>" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">FAQ</a>
            <a href="<?php echo esc_url( home_url( '/about' ) ); ?>" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Affiliates</a>
        </nav>

        <!-- Zone 3: Actions -->
        <div class="flex items-center gap-4">
            <a href="<?php echo esc_url( home_url( '/login' ) ); ?>" class="hidden sm:block text-sm font-bold border border-white/10 px-6 py-2.5 rounded-lg hover:bg-white/5 transition-all text-white">
                Client Login
            </a>
            <a href="<?php echo esc_url( home_url( '/vps' ) ); ?>" class="px-6 py-2.5 bg-[#FF4D00] hover:bg-[#FF6A00] text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-orange-600/20 whitespace-nowrap">
                Order Now
            </a>
            <button class="lg:hidden p-2 text-slate-400 hover:text-white" id="mobile-menu-toggle">
                <i data-lucide="menu"></i>
            </button>
        </div>
    </div>
</header>

<div class=""> <!-- No spacer needed for sticky header with promo -->

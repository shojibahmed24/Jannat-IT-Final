<?php
/**
 * Jannat IT — Server-Side SEO Meta Tags (Keyword Optimized)
 * Optimized with High-Volume, Low-Competition Long-Tail Keywords.
 */

function jannat_it_get_seo_data() {
    global $wp;
    $request = trim($wp->request ?? '', '/');
    $path_parts = explode('/', $request);
    $base_path = isset($path_parts[0]) ? $path_parts[0] : '';
    $site_name = get_bloginfo('name') ?: 'Jannat IT';
    $site_url = home_url('/');

    $seo_map = array(
        '' => array(
            'title'       => 'Buy NVMe VPS & Windows RDP with Full Admin Access — ' . $site_name,
            'description' => 'Looking for high performance cloud hosting? Buy cheap NVMe VPS, Forex RDP, and AMD EPYC dedicated servers with 99.9% uptime. Best VPS in Bangladesh.',
            'keywords'    => 'buy nvme vps, windows rdp with admin access, best vps in bangladesh, cheap forex rdp, amd epyc dedicated server',
        ),
        'vps' => array(
            'title'       => 'Cheap NVMe Cloud VPS Hosting for Developers — ' . $site_name,
            'description' => 'Deploy high-speed Linux & Windows VPS servers. Powered by 100% NVMe SSDs and AMD EPYC processors. Perfect for Node.js, WordPress, and custom apps. Starts at $4.99.',
            'keywords'    => 'cheap nvme vps, linux vps for developers, buy windows server vps, best cloud vps hosting, scalable vps',
        ),
        'rdp' => array(
            'title'       => 'Buy Cheap Windows RDP for Forex Trading & Botting — ' . $site_name,
            'description' => 'Get full admin access Windows RDP servers. 10Gbps port, DDoS protection, and 24/7 uptime. Ideal for Forex trading, web scraping, and running bots smoothly.',
            'keywords'    => 'buy windows rdp, cheap rdp for forex trading, rdp with admin access, windows rdp server, web scraping rdp',
        ),
        'dedicated' => array(
            'title'       => 'Unmetered 10Gbps Bare Metal Dedicated Servers — ' . $site_name,
            'description' => 'Enterprise-grade bare metal dedicated servers with Intel Xeon and AMD EPYC. Unmetered 10Gbps bandwidth, full root access, and zero setup fees.',
            'keywords'    => 'unmetered dedicated server, bare metal server, 10gbps dedicated server, buy amd epyc server, cheap dedicated hosting',
        ),
        'domains' => array(
            'title'       => 'Cheap Domain Registration & Transfer — ' . $site_name,
            'description' => 'Search and register .com, .net, and .org domains at the lowest prices. Enjoy free WHOIS privacy protection, DNS management, and 24/7 support.',
            'keywords'    => 'cheap domain registration, buy .com domain, domain transfer, free whois privacy',
        ),
        'about' => array(
            'title'       => 'About Us | Top Rated Hosting Provider — ' . $site_name,
            'description' => 'Learn how ' . $site_name . ' became a trusted provider for NVMe VPS and RDP servers. We focus on speed, security, and exceptional customer support.',
            'keywords'    => 'about jannat it, hosting provider bangladesh, reliable vps company',
        ),
        'blog' => array(
            'title'       => 'Server Administration & Hosting Tutorials Blog — ' . $site_name,
            'description' => 'Read expert guides on securing Linux VPS, optimizing Windows RDP, configuring web servers, and the latest news in cloud computing.',
            'keywords'    => 'linux vps tutorials, windows rdp guide, server security blog, hosting news',
        ),
        'contact' => array(
            'title'       => 'Contact Our 24/7 Hosting Support Team — ' . $site_name,
            'description' => 'Need help setting up your VPS or RDP? Contact our 24/7 technical support team. We resolve server issues rapidly.',
            'keywords'    => 'contact jannat it, hosting support, technical support vps',
        ),
        'faq' => array(
            'title'       => 'Hosting FAQ | VPS & RDP Questions Answered — ' . $site_name,
            'description' => 'Find answers to your questions about our NVMe VPS deployment times, RDP admin access, billing, and DDoS protection policies.',
            'keywords'    => 'vps faq, rdp questions, hosting support faq',
        ),
    );

    if (array_key_exists($base_path, $seo_map)) {
        return $seo_map[$base_path];
    }

    return array(
        'title'       => $site_name . ' — Premium Cloud Hosting',
        'description' => 'Deploy high-performance VPS, RDP & dedicated servers with ' . $site_name . '.',
        'keywords'    => 'vps hosting, windows rdp',
    );
}

// Inject meta tags into <head>
function jannat_it_inject_seo_meta() {
    global $wp;
    $seo = jannat_it_get_seo_data();
    $request = trim($wp->request ?? '', '/');
    $canonical = home_url('/' . $request);
    if (empty($request)) {
        $canonical = home_url('/');
    }

    echo '<meta name="description" content="' . esc_attr($seo['description']) . '" />' . "\n";
    if (!empty($seo['keywords'])) {
        echo '<meta name="keywords" content="' . esc_attr($seo['keywords']) . '" />' . "\n";
    }
    echo '<link rel="canonical" href="' . esc_url($canonical) . '" />' . "\n";

    echo '<meta property="og:type" content="website" />' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($seo['title']) . '" />' . "\n";
    echo '<meta property="og:description" content="' . esc_attr($seo['description']) . '" />' . "\n";
    echo '<meta property="og:url" content="' . esc_url($canonical) . '" />' . "\n";
    echo '<meta property="og:site_name" content="' . esc_attr(get_bloginfo('name')) . '" />' . "\n";
    echo '<meta property="og:locale" content="en_US" />' . "\n";

    if (has_custom_logo()) {
        $logo_url = wp_get_attachment_image_url(get_theme_mod('custom_logo'), 'full');
        echo '<meta property="og:image" content="' . esc_url($logo_url) . '" />' . "\n";
        echo '<meta name="twitter:image" content="' . esc_url($logo_url) . '" />' . "\n";
    }

    echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($seo['title']) . '" />' . "\n";
    echo '<meta name="twitter:description" content="' . esc_attr($seo['description']) . '" />' . "\n";

    echo '<link rel="preconnect" href="https://fonts.googleapis.com" />' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' . "\n";
    echo '<link rel="dns-prefetch" href="//embed.tawk.to" />' . "\n";
}
add_action('wp_head', 'jannat_it_inject_seo_meta', 1);

function jannat_it_seo_document_title($title) {
    $seo = jannat_it_get_seo_data();
    return $seo['title'];
}
add_filter('pre_get_document_title', 'jannat_it_seo_document_title', 999);
add_filter('wp_title', 'jannat_it_seo_document_title', 999);

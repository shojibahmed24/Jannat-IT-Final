<?php
/**
 * Jannat IT — Server-Side SEO Meta Tags
 * Injects proper <title>, meta description, Open Graph, Twitter Cards
 * for each React route BEFORE JavaScript loads.
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
            'title'       => $site_name . ' — Premium Cloud Hosting & VPS Solutions',
            'description' => 'Deploy high-performance VPS, RDP servers & dedicated hosting with NVMe SSD, DDoS protection, and 99.9% uptime guarantee. Starting at $4.99/mo.',
            'keywords'    => 'VPS hosting, cloud hosting, RDP server, dedicated server, NVMe SSD, DDoS protection, cheap VPS',
        ),
        'vps' => array(
            'title'       => 'Premium VPS Hosting — ' . $site_name,
            'description' => 'Scalable cloud VPS powered by AMD EPYC processors, 100% NVMe SSD storage, and 10Gbps network. Deploy in 60 seconds. Plans from $4.99/mo.',
            'keywords'    => 'VPS hosting, cloud VPS, NVMe VPS, cheap VPS, scalable VPS, AMD EPYC VPS',
        ),
        'rdp' => array(
            'title'       => 'Windows RDP Servers — ' . $site_name,
            'description' => 'Full admin Windows RDP servers with DDoS protection, NVMe storage, and 99.9% uptime. Perfect for forex trading, botting & remote work. From $6.99/mo.',
            'keywords'    => 'RDP server, Windows RDP, remote desktop, forex RDP, admin RDP, cheap RDP',
        ),
        'dedicated' => array(
            'title'       => 'Dedicated Servers — ' . $site_name,
            'description' => 'Bare-metal dedicated servers with Intel Xeon & AMD EPYC processors, up to 256GB RAM, and 10Gbps unmetered bandwidth. Enterprise-grade hosting.',
            'keywords'    => 'dedicated server, bare metal server, Intel Xeon server, AMD EPYC server, unmetered bandwidth',
        ),
        'domains' => array(
            'title'       => 'Domain Registration — ' . $site_name,
            'description' => 'Register .com, .net, .org, and 100+ domain extensions at competitive prices. Free WHOIS privacy, DNS management & email forwarding included.',
            'keywords'    => 'domain registration, buy domain, cheap domain, .com domain, domain transfer',
        ),
        'about' => array(
            'title'       => 'About Us — ' . $site_name,
            'description' => 'Learn about ' . $site_name . '\'s mission to deliver premium, affordable cloud hosting infrastructure since 2018. Trusted by thousands worldwide.',
            'keywords'    => 'about Jannat IT, hosting company, cloud infrastructure provider',
        ),
        'blog' => array(
            'title'       => 'Blog & News — ' . $site_name,
            'description' => 'Latest hosting tips, server tutorials, industry news, and product updates from the ' . $site_name . ' team.',
            'keywords'    => 'hosting blog, VPS tutorials, server guides, hosting news',
        ),
        'contact' => array(
            'title'       => 'Contact Us — ' . $site_name,
            'description' => 'Get in touch with our 24/7 expert support team. We\'re here to help with sales inquiries, technical support, and partnership opportunities.',
            'keywords'    => 'contact Jannat IT, hosting support, technical support',
        ),
        'faq' => array(
            'title'       => 'Frequently Asked Questions — ' . $site_name,
            'description' => 'Find answers to common questions about VPS hosting, RDP servers, billing, DDoS protection, server deployment, and more.',
            'keywords'    => 'hosting FAQ, VPS questions, RDP FAQ, server FAQ',
        ),
        'affiliate' => array(
            'title'       => 'Affiliate Program — ' . $site_name,
            'description' => 'Earn generous commissions by referring customers to ' . $site_name . '. Join our affiliate program and start earning today.',
            'keywords'    => 'hosting affiliate program, earn commissions, referral program',
        ),
        'terms-of-service' => array(
            'title'       => 'Terms of Service — ' . $site_name,
            'description' => 'Read the terms and conditions governing the use of ' . $site_name . ' hosting services.',
            'keywords'    => '',
        ),
        'privacy-policy' => array(
            'title'       => 'Privacy Policy — ' . $site_name,
            'description' => 'Learn how ' . $site_name . ' collects, uses, and protects your personal information.',
            'keywords'    => '',
        ),
        'acceptable-use' => array(
            'title'       => 'Acceptable Use Policy — ' . $site_name,
            'description' => 'Review the acceptable use policy for ' . $site_name . ' hosting services.',
            'keywords'    => '',
        ),
    );

    if (array_key_exists($base_path, $seo_map)) {
        return $seo_map[$base_path];
    }

    // Default fallback
    return array(
        'title'       => $site_name . ' — Premium Cloud Hosting',
        'description' => 'Deploy high-performance VPS, RDP & dedicated servers with ' . $site_name . '.',
        'keywords'    => 'VPS hosting, cloud hosting, dedicated server',
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

    // Meta Description
    echo '<meta name="description" content="' . esc_attr($seo['description']) . '" />' . "\n";

    // Keywords (if not empty)
    if (!empty($seo['keywords'])) {
        echo '<meta name="keywords" content="' . esc_attr($seo['keywords']) . '" />' . "\n";
    }

    // Canonical URL
    echo '<link rel="canonical" href="' . esc_url($canonical) . '" />' . "\n";

    // Open Graph
    echo '<meta property="og:type" content="website" />' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($seo['title']) . '" />' . "\n";
    echo '<meta property="og:description" content="' . esc_attr($seo['description']) . '" />' . "\n";
    echo '<meta property="og:url" content="' . esc_url($canonical) . '" />' . "\n";
    echo '<meta property="og:site_name" content="' . esc_attr(get_bloginfo('name')) . '" />' . "\n";
    echo '<meta property="og:locale" content="en_US" />' . "\n";

    // Custom logo as OG image
    if (has_custom_logo()) {
        $logo_url = wp_get_attachment_image_url(get_theme_mod('custom_logo'), 'full');
        echo '<meta property="og:image" content="' . esc_url($logo_url) . '" />' . "\n";
        echo '<meta name="twitter:image" content="' . esc_url($logo_url) . '" />' . "\n";
    }

    // Twitter Card
    echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($seo['title']) . '" />' . "\n";
    echo '<meta name="twitter:description" content="' . esc_attr($seo['description']) . '" />' . "\n";

    // Preconnect hints for performance
    echo '<link rel="preconnect" href="https://fonts.googleapis.com" />' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' . "\n";

    // DNS prefetch for third-party services
    echo '<link rel="dns-prefetch" href="//embed.tawk.to" />' . "\n";
}
add_action('wp_head', 'jannat_it_inject_seo_meta', 1);

// Override document title
function jannat_it_seo_document_title($title) {
    $seo = jannat_it_get_seo_data();
    return $seo['title'];
}
add_filter('pre_get_document_title', 'jannat_it_seo_document_title', 999);
add_filter('wp_title', 'jannat_it_seo_document_title', 999);

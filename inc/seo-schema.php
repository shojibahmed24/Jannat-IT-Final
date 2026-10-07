<?php
/**
 * Jannat IT — Schema.org / JSON-LD Structured Data
 * Injects Rich Snippet data for Google.
 */

function jannat_it_inject_schema() {
    global $wp;
    $request = trim($wp->request ?? '', '/');
    $path_parts = explode('/', $request);
    $base_path = isset($path_parts[0]) ? $path_parts[0] : '';
    $site_url = home_url();
    $site_name = get_bloginfo('name') ?: 'Jannat IT';

    // 1. Organization Schema (Everywhere)
    $org_schema = array(
        '@context' => 'https://schema.org',
        '@type'    => 'Organization',
        'name'     => $site_name,
        'url'      => $site_url,
        'logo'     => has_custom_logo() ? wp_get_attachment_image_url(get_theme_mod('custom_logo'), 'full') : $site_url . '/logo.png',
        'contactPoint' => array(
            '@type'       => 'ContactPoint',
            'telephone'   => get_option('options_phone_number', '+880 1234 567890'),
            'contactType' => 'customer service',
            'email'       => get_option('options_support_email', 'support@jannatit.com'),
            'availableLanguage' => array('English', 'Bengali')
        ),
        'sameAs' => array_filter(array(
            get_option('options_social_facebook', ''),
            get_option('options_social_twitter', ''),
            get_option('options_social_linkedin', ''),
        ))
    );
    echo '<script type="application/ld+json">' . json_encode($org_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";

    // 2. WebSite Schema (Home Page)
    if (empty($base_path)) {
        $website_schema = array(
            '@context' => 'https://schema.org',
            '@type'    => 'WebSite',
            'url'      => $site_url,
            'name'     => $site_name,
            'potentialAction' => array(
                '@type'       => 'SearchAction',
                'target'      => $site_url . '/?s={search_term_string}',
                'query-input' => 'required name=search_term_string'
            )
        );
        echo '<script type="application/ld+json">' . json_encode($website_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
    }

    // 3. Product Schema (VPS, RDP, Dedicated)
    if (in_array($base_path, array('vps', 'rdp', 'dedicated'))) {
        $prices = array(
            'vps' => '4.99',
            'rdp' => '6.99',
            'dedicated' => '79.99'
        );
        $names = array(
            'vps' => 'Premium Cloud VPS Hosting',
            'rdp' => 'Windows RDP Server',
            'dedicated' => 'Bare-Metal Dedicated Server'
        );
        
        $product_schema = array(
            '@context' => 'https://schema.org',
            '@type'    => 'Product',
            'name'     => $names[$base_path],
            'description' => 'High performance ' . strtolower($names[$base_path]) . ' with 99.9% uptime guarantee and enterprise DDoS protection.',
            'brand'    => array(
                '@type' => 'Brand',
                'name'  => $site_name
            ),
            'offers'   => array(
                '@type'         => 'Offer',
                'url'           => $site_url . '/' . $base_path,
                'priceCurrency' => 'USD',
                'price'         => $prices[$base_path],
                'availability'  => 'https://schema.org/InStock',
                'seller'        => array(
                    '@type' => 'Organization',
                    'name'  => $site_name
                )
            )
        );
        echo '<script type="application/ld+json">' . json_encode($product_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
    }

    // 4. FAQ Schema (FAQ Page)
    if ($base_path === 'faq') {
        $faqs = get_posts(array(
            'post_type' => 'faq',
            'numberposts' => 10,
            'post_status' => 'publish'
        ));
        
        if (!empty($faqs)) {
            $faq_schema = array(
                '@context' => 'https://schema.org',
                '@type'    => 'FAQPage',
                'mainEntity' => array()
            );
            
            foreach ($faqs as $faq) {
                $faq_schema['mainEntity'][] = array(
                    '@type' => 'Question',
                    'name'  => $faq->post_title,
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => wp_strip_all_tags($faq->post_content)
                    )
                );
            }
            echo '<script type="application/ld+json">' . json_encode($faq_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
        }
    }
}
add_action('wp_head', 'jannat_it_inject_schema', 2);

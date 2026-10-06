<?php
/**
 * Jannat IT - Full Demo Importer
 * Automatically generates all mock data (Pages, Menus, Options, Posts) on activation.
 */

function jannat_it_full_demo_importer() {
    // Only run if it hasn't been imported yet
    if ( get_option('jannat_it_full_demo_imported_v1') ) {
        return;
    }

    // 1. CLEAR EXISTING DUMMY HOSTING PLANS (if any from previous bad imports)
    $existing_plans = get_posts(array('post_type' => 'hosting_plan', 'numberposts' => -1, 'post_status' => 'any'));
    foreach ($existing_plans as $plan) {
        wp_delete_post($plan->ID, true);
    }
    $existing_faqs = get_posts(array('post_type' => 'faq', 'numberposts' => -1, 'post_status' => 'any'));
    foreach ($existing_faqs as $faq) {
        wp_delete_post($faq->ID, true);
    }
    $existing_testi = get_posts(array('post_type' => 'testimonial', 'numberposts' => -1, 'post_status' => 'any'));
    foreach ($existing_testi as $t) {
        wp_delete_post($t->ID, true);
    }

    // 2. CREATE PAGES
    $pages_to_create = array(
        'Home' => 'home',
        'About Us' => 'about',
        'Terms of Service' => 'terms-of-service',
        'Privacy Policy' => 'privacy-policy',
        'Acceptable Use Policy' => 'acceptable-use',
        'Affiliate Program' => 'affiliate'
    );
    $page_ids = array();
    foreach ($pages_to_create as $title => $slug) {
        $page = get_page_by_path($slug);
        if (!$page) {
            $page_ids[$slug] = wp_insert_post(array(
                'post_title' => $title,
                'post_name' => $slug,
                'post_type' => 'page',
                'post_status' => 'publish'
            ));
        } else {
            $page_ids[$slug] = $page->ID;
        }
    }

    // 3. CREATE MENU
    $menu_name = 'Primary Menu';
    $menu_exists = wp_get_nav_menu_object( $menu_name );
    if( !$menu_exists ) {
        $menu_id = wp_create_nav_menu($menu_name);
        wp_update_nav_menu_item($menu_id, 0, array('menu-item-title' => 'VPS Hosting', 'menu-item-url' => '/vps', 'menu-item-status' => 'publish'));
        wp_update_nav_menu_item($menu_id, 0, array('menu-item-title' => 'RDP Servers', 'menu-item-url' => '/rdp', 'menu-item-status' => 'publish'));
        wp_update_nav_menu_item($menu_id, 0, array('menu-item-title' => 'Dedicated', 'menu-item-url' => '/dedicated', 'menu-item-status' => 'publish'));
        wp_update_nav_menu_item($menu_id, 0, array('menu-item-title' => 'Domains', 'menu-item-url' => '/domains', 'menu-item-status' => 'publish'));
        wp_update_nav_menu_item($menu_id, 0, array('menu-item-title' => 'About Us', 'menu-item-url' => '/about', 'menu-item-status' => 'publish'));
        
        // Assign to theme location
        $locations = get_theme_mod('nav_menu_locations');
        $locations['primary_menu'] = $menu_id;
        set_theme_mod('nav_menu_locations', $locations);
    }

    // 4. THEME OPTIONS (ACF Options Page)
    update_option('options_support_email', 'support@jannatit.net');
    update_option('options_phone', '+880 1234-567890');
    update_option('options_office_address', "Dhaka, Bangladesh\n(Visits by appointment only for enterprise clients)");
    update_option('options_facebook_url', '#');
    update_option('options_twitter_url', '#');

    // 5. TESTIMONIALS
    function insert_mock_testimonial($name, $role, $quote) {
        $post_id = wp_insert_post(array(
            'post_title' => $name,
            'post_content' => $quote,
            'post_type' => 'testimonial',
            'post_status' => 'publish'
        ));
        update_post_meta($post_id, 'role', $role);
    }
    insert_mock_testimonial("Ahmed R.", "CEO, TechStartup BD", "Jannat IT's infrastructure has been rock solid. We migrated our entire SaaS platform and haven't had a single minute of downtime in 6 months.");
    insert_mock_testimonial("Sarah K.", "CTO, GameHost Pro", "Their DDoS protection saved us during a massive attack. The team responded within minutes and our services stayed online throughout.");
    insert_mock_testimonial("David L.", "DevOps Lead, CloudApp", "We migrated from a major cloud provider and now save 60% monthly. The NVMe performance is incredible - our database queries are 3x faster.");

    // 6. FAQS
    function insert_mock_faq($q, $a) {
        wp_insert_post(array(
            'post_title' => $q,
            'post_content' => $a,
            'post_type' => 'faq',
            'post_status' => 'publish'
        ));
    }
    insert_mock_faq("What is the uptime guarantee?", "We guarantee 99.9% network and power uptime. If we fail to meet this, you are eligible for account credits under our SLA.");
    insert_mock_faq("Do you provide DDoS protection?", "Yes, all plans include enterprise-grade L3/L4 DDoS mitigation to keep your services online during attacks.");
    insert_mock_faq("Can I upgrade my plan later?", "Absolutely. You can scale your resources up or down at any time seamlessly through our client portal.");
    insert_mock_faq("What payment methods do you accept?", "We accept MasterCard, Crypto, Wise, and Payoneer for maximum convenience.");
    insert_mock_faq("How long does server deployment take?", "VPS and RDP instances are deployed automatically within 60 seconds of payment confirmation. Dedicated servers typically take 15 to 45 minutes depending on the hardware configuration and OS installation.");

    // 7. HOSTING PLANS (Matching exactly with React default)
    function insert_mock_plan($title, $category_slug, $category_name, $monthly, $yearly, $old, $specs, $popular) {
        $post_id = wp_insert_post(array(
            'post_title' => $title,
            'post_type' => 'hosting_plan',
            'post_status' => 'publish',
        ));
        if ( !is_wp_error($post_id) ) {
            $term = term_exists($category_slug, 'hosting_category');
            if (!$term) {
                $term = wp_insert_term($category_name, 'hosting_category', array('slug' => $category_slug));
            }
            if (!is_wp_error($term) && isset($term['term_id'])) {
                wp_set_object_terms( $post_id, (int)$term['term_id'], 'hosting_category' );
            }
            update_post_meta($post_id, 'price_monthly', $monthly);
            update_post_meta($post_id, 'price_yearly', $yearly);
            update_post_meta($post_id, 'old_price', $old);
            update_post_meta($post_id, 'specs', $specs);
            update_post_meta($post_id, 'is_popular', $popular ? 'yes' : 'no');
            $pid = $popular ? '1' : '2';
            update_post_meta($post_id, 'whmcs_link', 'https://my.jannatit.net/cart.php?a=add&pid=' . $pid);
        }
    }
    // VPS Plans
    insert_mock_plan('Starter Cloud', 'vps', 'VPS Hosting', '4.99', '49.90', '9.99', '1 vCPU Core, 2GB RAM, 40GB NVMe SSD, 1Gbps Network', false);
    insert_mock_plan('Professional', 'vps', 'VPS Hosting', '9.99', '99.90', '19.99', '2 vCPU Cores, 4GB RAM, 80GB NVMe SSD, 2Gbps Network', false);
    insert_mock_plan('Business', 'vps', 'VPS Hosting', '14.99', '149.90', '29.99', '4 vCPU Cores, 8GB RAM, 160GB NVMe SSD, 5Gbps Network', true);
    insert_mock_plan('Enterprise', 'vps', 'VPS Hosting', '29.99', '299.90', '49.99', '8 vCPU Cores, 16GB RAM, 320GB NVMe SSD, 10Gbps Network', false);
    // RDP Plans
    insert_mock_plan('User RDP', 'rdp', 'RDP Servers', '6.99', '69.90', '12.99', '2 vCPU Cores, 4GB RAM, 50GB NVMe, 1Gbps Port, No Admin Access', false);
    insert_mock_plan('Pro RDP', 'rdp', 'RDP Servers', '9.99', '99.90', '19.99', '4 vCPU Cores, 8GB RAM, 100GB NVMe, 1Gbps Port, Full Admin Access', false);
    insert_mock_plan('Admin RDP', 'rdp', 'RDP Servers', '14.99', '149.90', '29.99', '6 vCPU Cores, 12GB RAM, 150GB NVMe, 2Gbps Port, Full Admin Access', true);
    insert_mock_plan('Forex/Botting', 'rdp', 'RDP Servers', '24.99', '249.90', '39.99', '8 vCPU Cores, 16GB RAM, 200GB NVMe, 5Gbps Port, Full Admin Access', false);
    // Dedicated Plans
    insert_mock_plan('Power E3', 'dedicated', 'Dedicated Servers', '79.99', '799.90', '99.99', 'Intel Xeon E3-1230, 4 Cores / 8 Threads, 32 GB RAM, 500 GB NVMe, 1Gbps Unmetered', false);
    insert_mock_plan('Advanced Epyc', 'dedicated', 'Dedicated Servers', '119.99', '1199.90', '149.99', 'AMD EPYC 7232P, 8 Cores / 16 Threads, 64 GB RAM, 1 TB NVMe, 5Gbps Unmetered', false);
    insert_mock_plan('Elite Epyc', 'dedicated', 'Dedicated Servers', '169.99', '1699.90', '219.99', 'AMD EPYC 7313P, 16 Cores / 32 Threads, 128 GB RAM, 2x 1TB NVMe, 10Gbps Unmetered', true);
    insert_mock_plan('Titan Dual', 'dedicated', 'Dedicated Servers', '299.99', '2999.90', '399.99', 'Dual Xeon Gold 6130, 32 Cores / 64 Threads, 256 GB RAM, 4x 2TB NVMe, 10Gbps Unmetered', false);

    update_option('jannat_it_full_demo_imported_v1', true);
}
add_action('admin_init', 'jannat_it_full_demo_importer');

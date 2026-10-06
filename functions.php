<?php
/**
 * Jannat IT Theme functions and definitions
 */

if ( ! defined( 'JANNAT_IT_VERSION' ) ) {
	define( 'JANNAT_IT_VERSION', '1.0.0' );
}

function jannat_it_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	register_nav_menus( array(
		'primary' => 'Primary Header Menu',
		'footer'  => 'Footer Menu',
	) );
}
add_action( 'after_setup_theme', 'jannat_it_setup' );

// Include Custom Post Types and REST API Endpoints
require_once get_template_directory() . '/inc/cpt-hosting.php';
require_once get_template_directory() . '/inc/api-endpoints.php';
require_once get_template_directory() . '/inc/meta-boxes.php';
require_once get_template_directory() . '/inc/theme-options.php';
require_once get_template_directory() . '/inc/acf-hosting-plans.php';

/**
 * Enqueue scripts and styles from Vite's manifest.json
 */
function jannat_it_scripts() {
    $dist_uri  = get_template_directory_uri() . '/dist';
    $dist_path = get_template_directory() . '/dist';
    
    // In development mode (Set this to false in production)
    $is_dev = defined('WP_ENVIRONMENT_TYPE') && 'development' === WP_ENVIRONMENT_TYPE;

    if ( $is_dev ) {
        // Enqueue Vite dev server scripts
        wp_enqueue_script( 'vite-client', 'http://localhost:3000/@vite/client', array(), null, false );
        wp_enqueue_script( 'jannat-it-main', 'http://localhost:3000/src/main.tsx', array(), null, true );
    } else {
        // Production: read manifest.json
        $manifest_path = $dist_path . '/.vite/manifest.json';
        
        if ( file_exists( $manifest_path ) ) {
            $manifest = json_decode( file_get_contents( $manifest_path ), true );
            
            if ( isset( $manifest['src/main.tsx'] ) ) {
                $main_js = $manifest['src/main.tsx']['file'];
                $main_css = isset( $manifest['src/main.tsx']['css'] ) ? $manifest['src/main.tsx']['css'][0] : '';
                
                wp_enqueue_script( 'jannat-it-main', $dist_uri . '/' . $main_js, array(), JANNAT_IT_VERSION, true );
                
                if ( $main_css ) {
                    wp_enqueue_style( 'jannat-it-style', $dist_uri . '/' . $main_css, array(), JANNAT_IT_VERSION );
                }
            }
        }
    }

    // Pass WP Data to React Global Window Object
    wp_localize_script( 'jannat-it-main', 'wpData', array(
        'apiUrl'  => esc_url_raw( rest_url() ),
        'nonce'   => wp_create_nonce( 'wp_rest' ),
        'siteUrl' => site_url(),
        'themeUrl' => get_template_directory_uri()
    ) );
}
add_action( 'wp_enqueue_scripts', 'jannat_it_scripts' );

// Add type="module" to scripts so Vite works properly
function jannat_it_add_module_to_scripts( $tag, $handle, $src ) {
    if ( in_array( $handle, array( 'vite-client', 'jannat-it-main' ) ) ) {
        return '<script type="module" src="' . esc_url( $src ) . '"></script>';
    }
    return $tag;
}
add_filter( 'script_loader_tag', 'jannat_it_add_module_to_scripts', 10, 3 );
require_once get_template_directory() . '/inc/acf-pages.php';


<?php
function jannat_it_auto_import_demo_data_v2() {
    // Only run if it hasn't been imported yet
    if ( get_option('jannat_it_demo_imported_v3') ) {
        return;
    }

    // First delete all existing hosting plans to avoid duplicates from the previous bad import
    $existing_plans = get_posts(array('post_type' => 'hosting_plan', 'numberposts' => -1, 'post_status' => 'any'));
    foreach ($existing_plans as $plan) {
        wp_delete_post($plan->ID, true);
    }

    // Helper to create a plan
    function insert_mock_plan($title, $category_slug, $category_name, $monthly, $yearly, $old, $specs, $popular) {
        $post_id = wp_insert_post(array(
            'post_title' => $title,
            'post_type' => 'hosting_plan',
            'post_status' => 'publish',
        ));
        if ( !is_wp_error($post_id) ) {
            // Ensure taxonomy exists and get ID
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

    update_option('jannat_it_demo_imported_v3', true);
}
add_action('admin_init', 'jannat_it_auto_import_demo_data_v2');

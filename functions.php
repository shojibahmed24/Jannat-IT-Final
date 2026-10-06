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

function jannat_it_auto_import_demo_data() {
    // Only run if it hasn't been imported yet
    if ( get_option('jannat_it_demo_imported_2') ) {
        return;
    }

    // Helper to create a plan
    function insert_mock_plan($title, $category_slug, $monthly, $yearly, $old, $specs, $popular) {
        $post_id = wp_insert_post(array(
            'post_title' => $title,
            'post_type' => 'hosting_plan',
            'post_status' => 'publish',
        ));
        if ( !is_wp_error($post_id) ) {
            wp_set_object_terms( $post_id, $category_slug, 'hosting_category' );
            update_post_meta($post_id, 'price_monthly', $monthly);
            update_post_meta($post_id, 'price_yearly', $yearly);
            update_post_meta($post_id, 'old_price', $old);
            update_post_meta($post_id, 'specs', $specs);
            update_post_meta($post_id, 'is_popular', $popular ? 'yes' : 'no');
            update_post_meta($post_id, 'whmcs_link', 'https://my.jannatit.net/cart.php?a=add');
        }
    }

    // Ensure taxonomy exists
    if (!term_exists('vps', 'hosting_category')) wp_insert_term('VPS Hosting', 'hosting_category', array('slug'=>'vps'));
    if (!term_exists('rdp', 'hosting_category')) wp_insert_term('RDP Servers', 'hosting_category', array('slug'=>'rdp'));
    if (!term_exists('dedicated', 'hosting_category')) wp_insert_term('Dedicated Servers', 'hosting_category', array('slug'=>'dedicated'));

    // VPS Plans
    insert_mock_plan('Basic VPS', 'vps', '9', '90', '15', '2 vCPU Cores, 4GB RAM, 80GB NVMe, 1TB Bandwidth, 1 Dedicated IP', false);
    insert_mock_plan('Pro VPS', 'vps', '19', '190', '29', '4 vCPU Cores, 8GB RAM, 160GB NVMe, 2TB Bandwidth, 1 Dedicated IP, Daily Backups', true);
    insert_mock_plan('Elite VPS', 'vps', '39', '390', '49', '8 vCPU Cores, 16GB RAM, 320GB NVMe, 5TB Bandwidth, 2 Dedicated IPs, Daily Backups, Advanced DDoS Protection', false);

    // RDP Plans
    insert_mock_plan('Starter RDP', 'rdp', '15', '150', '25', '2 vCPU Cores, 4GB RAM, 60GB NVMe, Windows Server 2022, 1Gbps Port, Admin Access', false);
    insert_mock_plan('Business RDP', 'rdp', '25', '250', '35', '4 vCPU Cores, 8GB RAM, 120GB NVMe, Windows Server 2022, 1Gbps Port, Admin Access, Daily Backups', true);
    insert_mock_plan('Premium RDP', 'rdp', '45', '450', '60', '8 vCPU Cores, 16GB RAM, 250GB NVMe, Windows Server 2022, 10Gbps Port, Admin Access, Daily Backups', false);

    // Dedicated Plans
    insert_mock_plan('E-2288G Server', 'dedicated', '99', '990', '129', 'Intel Xeon E-2288G (8c/16t), 32GB ECC RAM, 2x 500GB NVMe, 1Gbps Unmetered, 5 IPs, IPMI/KVM Access', false);
    insert_mock_plan('Ryzen 9 5950X', 'dedicated', '149', '1490', '199', 'AMD Ryzen 9 5950X (16c/32t), 128GB DDR4, 2x 2TB NVMe Gen4, 10Gbps Port, 5 IPs, IPMI/KVM Access', true);
    insert_mock_plan('EPYC 7302P', 'dedicated', '199', '1990', '259', 'AMD EPYC 7302P (16c/32t), 256GB ECC RAM, 4x 2TB NVMe Gen4, 10Gbps Port, 13 IPs, Hardware RAID 10', false);

    update_option('jannat_it_demo_imported_2', true);
}
add_action('admin_init', 'jannat_it_auto_import_demo_data');

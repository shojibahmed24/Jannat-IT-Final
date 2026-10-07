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


require_once get_template_directory() . '/inc/full-demo-importer.php';


// Override 404 for React SPA Routes
function jannat_it_react_routes_override() {
    global $wp_query, $wp;
    $react_routes = array('vps', 'rdp', 'dedicated', 'domains', 'about', 'contact', 'faq', 'affiliate', 'terms-of-service', 'privacy-policy', 'acceptable-use', 'blog', 'clientarea');
    
    $request = trim($wp->request, '/');
    $path_parts = explode('/', $request);
    $base_path = isset($path_parts[0]) ? $path_parts[0] : '';

    if ( in_array($base_path, $react_routes) ) {
        status_header( 200 );
        $wp_query->is_404 = false;
    }
}
add_action( 'template_redirect', 'jannat_it_react_routes_override' );

// Document Title is now handled by inc/seo-meta.php

require_once get_template_directory() . '/inc/native-theme-options.php';


// SEO & Performance Additions
require_once get_template_directory() . '/inc/seo-meta.php';
require_once get_template_directory() . '/inc/seo-sitemap.php';
require_once get_template_directory() . '/inc/seo-schema.php';


require_once get_template_directory() . '/inc/seo-bridge.php';

require_once get_template_directory() . '/inc/seo-performance.php';


// Auto-inject Blog menu item if missing
add_action('admin_init', 'jannat_it_force_add_blog_menu');
function jannat_it_force_add_blog_menu() {
    if (get_option('jannat_it_blog_menu_added_v2') === 'yes') return;

    $menu = wp_get_nav_menu_object('Primary Menu');
    if ($menu) {
        $items = wp_get_nav_menu_items($menu->term_id);
        $has_blog = false;
        
        if (is_array($items)) {
            foreach ($items as $item) {
                if (strcasecmp($item->title, 'Blog') === 0 || strcasecmp($item->title, 'Blog & News') === 0) {
                    $has_blog = true;
                    break;
                }
            }
        }

        if (!$has_blog) {
            wp_update_nav_menu_item($menu->term_id, 0, array(
                'menu-item-title'  => 'Blog',
                'menu-item-url'    => '/blog',
                'menu-item-status' => 'publish',
                // Position after domains (domains is usually at index 3 or 4)
                'menu-item-position' => 5,
            ));
        }
        update_option('jannat_it_blog_menu_added_v2', 'yes');
    }
}

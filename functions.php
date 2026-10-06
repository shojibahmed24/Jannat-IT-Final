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

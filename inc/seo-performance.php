<?php
/**
 * Jannat IT — Advanced Performance & Core Web Vitals
 * 
 * 1. Auto-converts uploaded JPEG/PNG images to WebP
 * 2. Injects advanced Preload hints
 * 3. LocalBusiness Schema for Bangladesh
 */

// ==========================================
// 1. AUTO WEBP CONVERSION ON UPLOAD
// ==========================================
function jannat_it_auto_convert_to_webp($upload) {
    // Only process JPEG and PNG images
    if ($upload['type'] === 'image/jpeg' || $upload['type'] === 'image/png') {
        $file_path = $upload['file'];
        
        // Use WordPress built-in image editor (GD or Imagick)
        $image_editor = wp_get_image_editor($file_path);
        
        if (!is_wp_error($image_editor) && function_exists('imagewebp')) {
            // Set quality for WebP
            $image_editor->set_quality(85);
            
            // Create new file name with .webp extension
            $path_info = pathinfo($file_path);
            $webp_filename = $path_info['dirname'] . '/' . $path_info['filename'] . '.webp';
            
            // Save as WebP
            $saved_image = $image_editor->save($webp_filename, 'image/webp');
            
            if (!is_wp_error($saved_image)) {
                // Update upload array to use the new WebP file
                $upload['file'] = $webp_filename;
                $upload['url']  = str_replace(basename($file_path), basename($webp_filename), $upload['url']);
                $upload['type'] = 'image/webp';
                
                // Remove the original JPEG/PNG to save disk space
                @unlink($file_path);
            }
        }
    }
    return $upload;
}
add_filter('wp_handle_upload', 'jannat_it_auto_convert_to_webp');


// ==========================================
// 2. ADVANCED PRELOADS & HINTS (LCP Optimization)
// ==========================================
function jannat_it_inject_performance_hints() {
    // Preload the main font to prevent FOIT (Flash of Invisible Text)
    echo '<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">' . "\n";
    echo '<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"></noscript>' . "\n";
    
    // DNS Prefetch for standard APIs
    echo '<link rel="dns-prefetch" href="//my.jannatit.net">' . "\n";
}
add_action('wp_head', 'jannat_it_inject_performance_hints', 0); // High priority


// ==========================================
// 3. LOCAL BUSINESS SCHEMA (Bangladesh SEO)
// ==========================================
function jannat_it_inject_local_seo() {
    // Only inject on Home Page or Contact Page
    global $wp;
    $request = trim($wp->request ?? '', '/');
    
    if (empty($request) || $request === 'contact') {
        $site_url = home_url();
        $site_name = get_bloginfo('name') ?: 'Jannat IT';
        
        $local_schema = array(
            '@context'   => 'https://schema.org',
            '@type'      => 'LocalBusiness',
            'name'       => $site_name,
            'image'      => has_custom_logo() ? wp_get_attachment_image_url(get_theme_mod('custom_logo'), 'full') : $site_url . '/logo.png',
            '@id'        => $site_url,
            'url'        => $site_url,
            'telephone'  => get_option('options_phone_number', '+8801234567890'),
            'priceRange' => '$$',
            'address'    => array(
                '@type'           => 'PostalAddress',
                'streetAddress'   => 'Dhaka, Bangladesh',
                'addressLocality' => 'Dhaka',
                'addressRegion'   => 'Dhaka',
                'postalCode'      => '1000',
                'addressCountry'  => 'BD'
            ),
            'openingHoursSpecification' => array(
                '@type'     => 'OpeningHoursSpecification',
                'dayOfWeek' => array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
                'opens'     => '00:00',
                'closes'    => '23:59'
            )
        );
        echo '<script type="application/ld+json">' . json_encode($local_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
    }
}
add_action('wp_head', 'jannat_it_inject_local_seo', 3);

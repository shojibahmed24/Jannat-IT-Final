<?php
/**
 * Jannat IT — Headless SEO Bridge & Content Enhancer
 * 
 * 1. Exposes RankMath / Yoast SEO data to the WP REST API
 * 2. Auto Internal Linking for targeted keywords in blog posts
 */

// ==========================================
// 1. HEADLESS SEO BRIDGE (RankMath / Yoast)
// ==========================================
function jannat_it_register_seo_rest_field() {
    $post_types = array('post', 'page', 'hosting_plan', 'faq');
    foreach ($post_types as $type) {
        register_rest_field($type, 'seo_data', array(
            'get_callback' => 'jannat_it_get_seo_data_for_api',
            'schema'       => null,
        ));
    }
}
add_action('rest_api_init', 'jannat_it_register_seo_rest_field');

function jannat_it_get_seo_data_for_api($object) {
    $post_id = $object['id'];
    $seo = array(
        'title'       => get_the_title($post_id),
        'description' => '',
        'keywords'    => '',
    );

    // RankMath Support
    if (class_exists('RankMath')) {
        $rm_title = get_post_meta($post_id, 'rank_math_title', true);
        $rm_desc  = get_post_meta($post_id, 'rank_math_description', true);
        
        if ($rm_title) {
            $seo['title'] = str_replace(
                array('%title%', '%sitename%', '%sep%'), 
                array(get_the_title($post_id), get_bloginfo('name'), '-'), 
                $rm_title
            );
        }
        if ($rm_desc) {
            $seo['description'] = str_replace(
                array('%title%', '%sitename%', '%sep%'), 
                array(get_the_title($post_id), get_bloginfo('name'), '-'), 
                $rm_desc
            );
        }
        $seo['keywords'] = get_post_meta($post_id, 'rank_math_focus_keyword', true);
    } 
    // Yoast Support
    elseif (defined('WPSEO_VERSION')) {
        $yoast_title = get_post_meta($post_id, '_yoast_wpseo_title', true);
        $yoast_desc  = get_post_meta($post_id, '_yoast_wpseo_metadesc', true);
        
        if ($yoast_title) {
            $seo['title'] = str_replace(
                array('%%title%%', '%%sitename%%', '%%sep%%'), 
                array(get_the_title($post_id), get_bloginfo('name'), '-'), 
                $yoast_title
            );
        }
        if ($yoast_desc) {
            $seo['description'] = str_replace(
                array('%%title%%', '%%sitename%%', '%%sep%%'), 
                array(get_the_title($post_id), get_bloginfo('name'), '-'), 
                $yoast_desc
            );
        }
        $seo['keywords'] = get_post_meta($post_id, '_yoast_wpseo_focuskw', true);
    }

    return $seo;
}


// ==========================================
// 2. AUTO INTERNAL LINKING FOR BLOG POSTS
// ==========================================
function jannat_it_auto_internal_links($content) {
    if (!is_singular('post') && !defined('REST_REQUEST')) {
        // We mainly want this to apply when fetching content via REST API for blog posts
    }

    $site_url = home_url();

    // The keywords we want to auto-link
    $keywords = array(
        'VPS Hosting'     => $site_url . '/vps',
        'VPS hosting'     => $site_url . '/vps',
        'VPS'             => $site_url . '/vps',
        'RDP Server'      => $site_url . '/rdp',
        'RDP server'      => $site_url . '/rdp',
        'Windows RDP'     => $site_url . '/rdp',
        'Dedicated Server'=> $site_url . '/dedicated',
        'Domain Name'     => $site_url . '/domains',
        'Domains'         => $site_url . '/domains',
    );

    // To prevent breaking HTML tags (like existing <a> tags or image alt attributes),
    // we use a complex regex or a simple DOMDocument approach.
    // A safe regex approach for replacing words OUTSIDE of HTML tags:
    
    foreach ($keywords as $word => $url) {
        // Regex explanation: Match the word, but only if it's not followed by something inside an HTML tag
        // Note: We only replace the FIRST occurrence of each keyword to avoid SEO keyword stuffing penalties (limit: 1)
        $pattern = '/\b(' . preg_quote($word, '/') . ')\b(?!(?:[^<]*>|[^>]*<\/a>))/s';
        
        // Use a callback to add our react router class if needed, or just a standard href
        $content = preg_replace($pattern, '<a href="' . $url . '" class="text-orange-500 hover:underline font-semibold">$1</a>', $content, 1);
    }

    return $content;
}
add_filter('the_content', 'jannat_it_auto_internal_links', 20);

<?php
/**
 * Custom REST API Endpoints for React Frontend
 */

function jannat_it_register_api_endpoints() {
    register_rest_route( 'jannat-it/v1', '/options', array(
        'methods'  => 'GET',
        'callback' => 'jannat_it_get_theme_options',
        'permission_callback' => '__return_true'
    ) );

    register_rest_route( 'jannat-it/v1', '/plans/(?P<category>[a-zA-Z0-9-]+)', array(
        'methods'  => 'GET',
        'callback' => 'jannat_it_get_hosting_plans',
        'permission_callback' => '__return_true'
    ) );

    register_rest_route( 'jannat-it/v1', '/faqs', array(
        'methods'  => 'GET',
        'callback' => 'jannat_it_get_faqs',
        'permission_callback' => '__return_true'
    ) );

    register_rest_route( 'jannat-it/v1', '/testimonials', array(
        'methods'  => 'GET',
        'callback' => 'jannat_it_get_testimonials',
        'permission_callback' => '__return_true'
    ) );

        register_rest_route( 'jannat-it/v1', '/page/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods'  => 'GET',
        'callback' => 'jannat_it_get_page_data',
        'permission_callback' => '__return_true'
    ) );

    
    register_rest_route( 'jannat-it/v1', '/blog', array(
        'methods'  => 'GET',
        'callback' => 'jannat_it_get_blog_posts',
        'permission_callback' => '__return_true'
    ) );

    register_rest_route( 'jannat-it/v1', '/blog/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods'  => 'GET',
        'callback' => 'jannat_it_get_single_post',
        'permission_callback' => '__return_true'
    ) );

    register_rest_route( 'jannat-it/v1', '/menu/(?P<location>[a-zA-Z0-9-]+)', array(
        'methods'  => 'GET',
        'callback' => 'jannat_it_get_menu',
        'permission_callback' => '__return_true'
    ) );
}
add_action( 'rest_api_init', 'jannat_it_register_api_endpoints' );

function jannat_it_get_theme_options() {
    $use_acf = function_exists('get_field');
    
    // Helper to safely get option from ACF or Native
    $get_opt = function($key, $default = '') use ($use_acf) {
        if ($use_acf && get_field($key, 'option')) {
            return get_field($key, 'option');
        }
        $val = get_option('options_' . $key);
        return !empty($val) ? $val : $default;
    };
    
    $promo_full = $get_opt('promo_text', 'Limited-time offer - save up to 55% on annual VPS plans');
    $promo_parts = explode(' - ', $promo_full);
    if (count($promo_parts) < 2) {
        $promo_parts = explode(' — ', $promo_full);
    }
    
    $promo_text = isset($promo_parts[0]) ? $promo_parts[0] : $promo_full;
    $promo_link_text = isset($promo_parts[1]) ? $promo_parts[1] : '';

    $client_login = $get_opt('client_login_url', 'https://billing.jannatit.com/clientarea.php');
    $whmcs_url = $get_opt('whmcs_url', 'https://billing.jannatit.com');
    $header_btn = $get_opt('header_button_url', $whmcs_url . '/cart.php?a=add&pid=1');

    $options = array(
        'siteTitle' => get_bloginfo('name'),
        'siteLogo'  => has_custom_logo() ? wp_get_attachment_image_url(get_theme_mod('custom_logo'), 'full') : '',
        'company' => array(
            'name' => 'Jannat IT',
            'support_email'  => $get_opt('support_email', 'support@jannatit.com'),
            'phone'          => $get_opt('phone_number', '+880 1234 567890'),
            'office_address' => $get_opt('office_address', ''),
        ),
        'links' => array(
            'client_login' => $client_login,
            'clientLogin'  => $client_login,
            'order_now'    => $header_btn,
            'orderNow'     => $header_btn,
            'whmcs_url'    => $whmcs_url,
            'facebook'     => $get_opt('social_facebook', ''),
            'twitter'      => $get_opt('social_twitter', ''),
            'linkedin'     => $get_opt('social_linkedin', ''),
            'telegram'     => $get_opt('social_telegram', ''),
            'whatsapp'     => $get_opt('social_whatsapp', ''),
            'telegram_url' => $get_opt('social_telegram', ''),
            'whatsapp_url' => $get_opt('social_whatsapp', ''),
        ),
        'promoBanner' => array(
            'active'   => !empty($promo_full),
            'text'     => $promo_text,
            'linkText' => $promo_link_text,
            'linkUrl'  => $get_opt('promo_link', '#pricing')
        ),
        'api' => array(
            'tawkto_id' => $get_opt('tawkto_id', ''),
        ),
        'vpsMarkup' => 0,
        'domainPrice' => '9.99',
        'domain_pricing' => $get_opt('domain_pricing', null)
    );
    return rest_ensure_response( $options );
}

function jannat_it_get_hosting_plans( $request ) {
    $category_slug = $request->get_param( 'category' );
    $args = array(
        'post_type'      => 'hosting_plan',
        'posts_per_page' => -1,
        'tax_query'      => array(
            array(
                'taxonomy' => 'plan_category',
                'field'    => 'slug',
                'terms'    => $category_slug,
            ),
        ),
    );
    $query = new WP_Query( $args );
    $plans = array();
    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $price_monthly = get_post_meta( get_the_ID(), 'price_monthly', true );
            $price_yearly  = get_post_meta( get_the_ID(), 'price_yearly', true );
            $specs_raw     = get_post_meta( get_the_ID(), 'specs', true );
            $popular       = get_post_meta( get_the_ID(), 'is_popular', true );
              $whmcs_link    = get_post_meta( get_the_ID(), 'whmcs_link', true );
            $old_price     = get_post_meta( get_the_ID(), 'old_price', true );
            $specs = array();
            if ( function_exists('have_rows') && have_rows('plan_specifications', get_the_ID()) ) {
                while ( have_rows('plan_specifications', get_the_ID()) ) {
                    the_row();
                    $specs[] = get_sub_field('feature_text');
                }
            }
            if ( empty($specs) ) {
                $specs = $specs_raw ? array_map('trim', explode(',', $specs_raw)) : array('Spec 1', 'Spec 2', 'Spec 3');
            }
            $plans[] = array(
                'id'         => get_post_field( 'post_name' ),
                'name'       => get_the_title(),
                'price'      => $price_monthly ? (float) $price_monthly : 9.99,
                'oldPrice'   => $old_price ? (float) $old_price : null,
                'specs'      => $specs,
                'popular'    => $popular === 'yes' ? true : false,
                  'orderUrl'   => $whmcs_link ? $whmcs_link : null,
            );
        }
        wp_reset_postdata();
    }
    return rest_ensure_response( $plans );
}

function jannat_it_get_faqs() {
    $args = array("post_type" => "faq", "posts_per_page" => -1);
    $query = new WP_Query($args);
    $faqs = array();
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $faqs[] = array(
                "q" => get_the_title(),
                "a" => wp_strip_all_tags(get_the_content())
            );
        }
        wp_reset_postdata();
    }
    return rest_ensure_response($faqs);
}

function jannat_it_get_testimonials() {
    $args = array("post_type" => "testimonial", "posts_per_page" => -1);
    $query = new WP_Query($args);
    $testimonials = array();
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $testimonials[] = array(
                "name"    => get_the_title(),
                "role"    => get_post_meta(get_the_ID(), "role", true) ?: "Client",
                "content" => wp_strip_all_tags(get_the_content()),
                "avatar"  => get_the_post_thumbnail_url(get_the_ID(), "thumbnail") ?: ""
            );
        }
        wp_reset_postdata();
    }
    return rest_ensure_response($testimonials);
}

function jannat_it_get_menu($request) {
    $location = $request->get_param('location');
    $locations = get_nav_menu_locations();
    if (!isset($locations[$location])) {
        return rest_ensure_response(array());
    }
    $menu_id = $locations[$location];
    $menu_items = wp_get_nav_menu_items($menu_id);
    $formatted_items = array();
    if ($menu_items) {
        foreach ($menu_items as $item) {
            if (!$item->menu_item_parent) {
                $path = str_replace(home_url(), '', $item->url);
                $formatted_items[] = array(
                    'id'    => $item->ID,
                    'name'  => $item->title,
                    'path'  => $path,
                    'url'   => $item->url,
                );
            }
        }
    }
    return rest_ensure_response($formatted_items);
}


function jannat_it_get_seo_meta( $post_id ) {
    $seo = array(
        'title'       => get_the_title( $post_id ) . ' - Jannat IT',
        'description' => wp_trim_words( get_post_field( 'post_content', $post_id ), 25, '...' ),
        'og_image'    => get_the_post_thumbnail_url( $post_id, 'full' )
    );

    // RankMath Support
    $rm_title = get_post_meta( $post_id, 'rank_math_title', true );
    if ( $rm_title ) $seo['title'] = str_replace(array('%sitename%', '%title%'), array('Jannat IT', get_the_title($post_id)), $rm_title);
    
    $rm_desc = get_post_meta( $post_id, 'rank_math_description', true );
    if ( $rm_desc ) $seo['description'] = $rm_desc;

    // Yoast Support
    $yoast_title = get_post_meta( $post_id, '_yoast_wpseo_title', true );
    if ( $yoast_title ) $seo['title'] = str_replace(array('%%sitename%%', '%%title%%'), array('Jannat IT', get_the_title($post_id)), $yoast_title);
    
    $yoast_desc = get_post_meta( $post_id, '_yoast_wpseo_metadesc', true );
    if ( $yoast_desc ) $seo['description'] = $yoast_desc;

    if (!$seo['og_image']) {
        $seo['og_image'] = get_template_directory_uri() . '/dist/assets/default-og.jpg';
    }

    return $seo;
}

function jannat_it_get_page_data($request) {
    $slug = $request->get_param('slug');
    $page = get_page_by_path($slug);
    
    if (!$page) {
        return rest_ensure_response(array('error' => 'Page not found'));
    }
    
    $data = array(
        'title' => $page->post_title,
        'content' => apply_filters('the_content', $page->post_content),
    );
    
    if (function_exists('get_fields')) {
        $acf_fields = get_fields($page->ID);
        if ($acf_fields) {
            $data['acf'] = $acf_fields;
        }
    }
    
    return rest_ensure_response($data);
}

function jannat_it_calculate_reading_time($content) {
    $word_count = str_word_count(strip_tags($content));
    $reading_time = ceil($word_count / 200);
    return max(1, $reading_time); // At least 1 min
}

function jannat_it_format_post($post) {
    $author_id = $post->post_author;
    $categories = get_the_category($post->ID);
    $category_name = !empty($categories) ? $categories[0]->name : 'Uncategorized';
    
    return array(
        'id'           => $post->ID,
        'slug'         => $post->post_name,
        'title'        => get_the_title($post->ID),
        'excerpt'      => wp_trim_words($post->post_content, 20),
        'content'      => apply_filters('the_content', $post->post_content),
        'thumbnail'    => get_the_post_thumbnail_url($post->ID, 'large') ?: '',
        'date'         => get_the_date('M j, Y', $post->ID),
        'author'       => get_the_author_meta('display_name', $author_id),
        'category'     => $category_name,
        'reading_time' => jannat_it_calculate_reading_time($post->post_content) . ' min read'
    );
}

function jannat_it_get_blog_posts($request) {
    $args = array(
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => 20,
    );
    $query = new WP_Query($args);
    $posts = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $posts[] = jannat_it_format_post($query->post);
        }
        wp_reset_postdata();
    }
    return rest_ensure_response($posts);
}

function jannat_it_get_single_post($request) {
    $slug = $request->get_param('slug');
    $args = array(
        'name'           => $slug,
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => 1
    );
    $query = new WP_Query($args);
    
    if ($query->have_posts()) {
        $query->the_post();
        $post_data = jannat_it_format_post($query->post);
        wp_reset_postdata();
        return rest_ensure_response($post_data);
    }
    
    return rest_ensure_response(array('error' => 'Post not found'));
}

<?php
/**
 * Jannat IT — XML Sitemap & robots.txt
 * Auto-generates sitemap.xml with all React routes + blog posts + hosting plans.
 */

// Register custom sitemap endpoint
function jannat_it_sitemap_rewrite() {
    add_rewrite_rule('^sitemap\.xml$', 'index.php?jannat_sitemap=1', 'top');
}
add_action('init', 'jannat_it_sitemap_rewrite');

function jannat_it_sitemap_query_var($vars) {
    $vars[] = 'jannat_sitemap';
    return $vars;
}
add_filter('query_vars', 'jannat_it_sitemap_query_var');

function jannat_it_sitemap_template() {
    if (get_query_var('jannat_sitemap') == 1) {
        header('Content-Type: application/xml; charset=UTF-8');
        header('X-Robots-Tag: noindex');

        $site_url = home_url();

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Static React routes with priorities
        $static_routes = array(
            ''              => array('priority' => '1.0', 'changefreq' => 'daily'),
            'vps'           => array('priority' => '0.9', 'changefreq' => 'weekly'),
            'rdp'           => array('priority' => '0.9', 'changefreq' => 'weekly'),
            'dedicated'     => array('priority' => '0.9', 'changefreq' => 'weekly'),
            'domains'       => array('priority' => '0.8', 'changefreq' => 'weekly'),
            'blog'          => array('priority' => '0.7', 'changefreq' => 'daily'),
            'about'         => array('priority' => '0.6', 'changefreq' => 'monthly'),
            'contact'       => array('priority' => '0.6', 'changefreq' => 'monthly'),
            'faq'           => array('priority' => '0.7', 'changefreq' => 'monthly'),
            'affiliate'     => array('priority' => '0.5', 'changefreq' => 'monthly'),
        );

        foreach ($static_routes as $path => $meta) {
            $loc = empty($path) ? $site_url . '/' : $site_url . '/' . $path;
            echo '  <url>' . "\n";
            echo '    <loc>' . esc_url($loc) . '</loc>' . "\n";
            echo '    <changefreq>' . $meta['changefreq'] . '</changefreq>' . "\n";
            echo '    <priority>' . $meta['priority'] . '</priority>' . "\n";
            echo '    <lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
            echo '  </url>' . "\n";
        }

        // Dynamic blog posts
        $blog_posts = get_posts(array(
            'post_type'   => 'post',
            'post_status' => 'publish',
            'numberposts' => -1,
        ));
        foreach ($blog_posts as $post) {
            echo '  <url>' . "\n";
            echo '    <loc>' . esc_url($site_url . '/blog/' . $post->post_name) . '</loc>' . "\n";
            echo '    <changefreq>weekly</changefreq>' . "\n";
            echo '    <priority>0.6</priority>' . "\n";
            echo '    <lastmod>' . get_the_modified_date('Y-m-d', $post) . '</lastmod>' . "\n";
            echo '  </url>' . "\n";
        }

        echo '</urlset>';
        exit;
    }
}
add_action('template_redirect', 'jannat_it_sitemap_template', 5);

// Custom robots.txt
function jannat_it_robots_txt($output, $public) {
    $site_url = home_url();
    $output  = "User-agent: *\n";
    $output .= "Allow: /\n";
    $output .= "Disallow: /wp-admin/\n";
    $output .= "Disallow: /wp-includes/\n";
    $output .= "Disallow: /admin-secret-2026\n";
    $output .= "Disallow: /wp-login.php\n";
    $output .= "Disallow: /wp-register.php\n";
    $output .= "\n";
    $output .= "# Crawl-delay for polite bots\n";
    $output .= "Crawl-delay: 1\n";
    $output .= "\n";
    $output .= "Sitemap: " . $site_url . "/sitemap.xml\n";
    return $output;
}
add_filter('robots_txt', 'jannat_it_robots_txt', 10, 2);

// Ping search engines on content update
function jannat_it_ping_search_engines($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id)) return;

    $sitemap_url = home_url('/sitemap.xml');
    
    // Ping Google
    wp_remote_get('https://www.google.com/ping?sitemap=' . urlencode($sitemap_url), array('blocking' => false));
}
add_action('publish_post', 'jannat_it_ping_search_engines');
add_action('publish_hosting_plan', 'jannat_it_ping_search_engines');


// Auto-flush rewrite rules once for sitemap
add_action('init', function() {
    if (get_option('jannat_it_seo_flushed_v1') !== 'yes') {
        flush_rewrite_rules();
        update_option('jannat_it_seo_flushed_v1', 'yes');
    }
}, 999);

<?php
/**
 * Jannat IT functions and definitions
 */

if ( ! function_exists( 'jannat_it_setup' ) ) :
    function jannat_it_setup() {
        // Add support for block styles, title tag, post thumbnails, etc.
        add_theme_support( 'title-tag' );
        add_theme_support( 'post-thumbnails' );
        add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ) );
        
        // Register Menus
        register_nav_menus( array(
            'primary' => esc_html__( 'Primary Menu', 'jannat-it' ),
            'footer-services' => esc_html__( 'Footer Services', 'jannat-it' ),
            'footer-support' => esc_html__( 'Footer Support', 'jannat-it' ),
            'footer-legal' => esc_html__( 'Footer Legal', 'jannat-it' ),
        ) );
    }
endif;
add_action( 'after_setup_theme', 'jannat_it_setup' );

/**
 * Enqueue scripts and styles.
 */
function jannat_it_scripts() {
    // Theme stylesheet
    wp_enqueue_style( 'jannat-it-style', get_stylesheet_uri(), array(), '1.0.0' );

    // Tailwind CSS via Play CDN (For easy conversion, can be optimized later)
    wp_enqueue_script( 'tailwind-cdn', 'https://cdn.tailwindcss.com', array(), null, false );

    // Custom Tailwind Config
    wp_add_inline_script( 'tailwind-cdn', "
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        orange: {
                            500: '#f97316',
                            600: '#ea580c',
                        }
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                    }
                }
            }
        }
    " );

    // Fonts
    wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap', array(), null );

    // Lucide Icons (Used in the React app)
    wp_enqueue_script( 'lucide-icons', 'https://unpkg.com/lucide@latest', array(), null, true );
    wp_add_inline_script( 'lucide-icons', 'lucide.createIcons();' );
}
add_action( 'wp_enqueue_scripts', 'jannat_it_scripts' );

/**
 * Phase 3: Custom Post Type for Plans
 */
function jannat_it_register_plans_cpt() {
    $labels = array(
        'name'                  => _x( 'Plans', 'Post Type General Name', 'jannat-it' ),
        'singular_name'         => _x( 'Plan', 'Post Type Singular Name', 'jannat-it' ),
        'menu_name'             => __( 'Hosting Plans', 'jannat-it' ),
        'add_new_item'          => __( 'Add New Plan', 'jannat-it' ),
    );
    $args = array(
        'label'                 => __( 'Plan', 'jannat-it' ),
        'labels'                => $labels,
        'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-cloud',
        'has_archive'           => true,
        'rewrite'               => array( 'slug' => 'plans' ),
    );
    register_post_type( 'hosting_plan', $args );

    // Register Taxonomy for Categories
    register_taxonomy( 'plan_category', 'hosting_plan', array(
        'hierarchical' => true,
        'labels' => array(
            'name' => 'Categories',
            'singular_name' => 'Category',
        ),
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => array( 'slug' => 'plan-category' ),
    ));
}
add_action( 'init', 'jannat_it_register_plans_cpt', 0 );

/**
 * Add Meta Boxes for Plans
 */
function jannat_it_add_plan_meta_boxes() {
    add_meta_box(
        'plan_details',
        'Plan Pricing & Details',
        'jannat_it_render_plan_meta_box',
        'hosting_plan',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'jannat_it_add_plan_meta_boxes' );

function jannat_it_render_plan_meta_box( $post ) {
    $monthly_price = get_post_meta( $post->ID, '_plan_monthly_price', true );
    $yearly_price = get_post_meta( $post->ID, '_plan_yearly_price', true );
    $pid = get_post_meta( $post->ID, '_plan_whmcs_pid', true );
    $features = get_post_meta( $post->ID, '_plan_features', true );
    $is_recommended = get_post_meta( $post->ID, '_plan_is_recommended', true );
    $color = get_post_meta( $post->ID, '_plan_color', true ); // blue, orange, purple
    ?>
    <table class="form-table">
        <tr>
            <th><label for="plan_monthly_price">Monthly Price ($)</label></th>
            <td><input type="text" name="plan_monthly_price" id="plan_monthly_price" value="<?php echo esc_attr($monthly_price); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="plan_yearly_price">Yearly Price ($)</label></th>
            <td><input type="text" name="plan_yearly_price" id="plan_yearly_price" value="<?php echo esc_attr($yearly_price); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="plan_whmcs_pid">WHMCS Product ID (PID)</label></th>
            <td><input type="text" name="plan_whmcs_pid" id="plan_whmcs_pid" value="<?php echo esc_attr($pid); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th colspan="2" style="background: #f0f0f0; padding: 10px;"><strong>Comparison Table Specs (Automatic Table)</strong></th>
        </tr>
        <tr>
            <th><label for="plan_spec_cpu">CPU Cores</label></th>
            <td><input type="text" name="plan_spec_cpu" id="plan_spec_cpu" value="<?php echo esc_attr(get_post_meta($post->ID, '_plan_spec_cpu', true)); ?>" class="regular-text" placeholder="e.g. 2 vCPU"></td>
        </tr>
        <tr>
            <th><label for="plan_spec_ram">RAM</label></th>
            <td><input type="text" name="plan_spec_ram" id="plan_spec_ram" value="<?php echo esc_attr(get_post_meta($post->ID, '_plan_spec_ram', true)); ?>" class="regular-text" placeholder="e.g. 4 GB"></td>
        </tr>
        <tr>
            <th><label for="plan_spec_storage">Storage</label></th>
            <td><input type="text" name="plan_spec_storage" id="plan_spec_storage" value="<?php echo esc_attr(get_post_meta($post->ID, '_plan_spec_storage', true)); ?>" class="regular-text" placeholder="e.g. 80 GB NVMe"></td>
        </tr>
        <tr>
            <th><label for="plan_spec_port">Network Port</label></th>
            <td><input type="text" name="plan_spec_port" id="plan_spec_port" value="<?php echo esc_attr(get_post_meta($post->ID, '_plan_spec_port', true)); ?>" class="regular-text" placeholder="e.g. 10 Gbps"></td>
        </tr>
        <tr>
            <th><label for="plan_spec_ip">IP Addresses</label></th>
            <td><input type="text" name="plan_spec_ip" id="plan_spec_ip" value="<?php echo esc_attr(get_post_meta($post->ID, '_plan_spec_ip', true)); ?>" class="regular-text" placeholder="e.g. 1 IPv4 + IPv6"></td>
        </tr>
        <tr>
            <th><label for="plan_spec_os">OS Support</label></th>
            <td><input type="text" name="plan_spec_os" id="plan_spec_os" value="<?php echo esc_attr(get_post_meta($post->ID, '_plan_spec_os', true)); ?>" class="regular-text" placeholder="e.g. Windows/Linux"></td>
        </tr>
        <tr>
            <th><label for="plan_color">Plan Color</label></th>
            <td>
                <select name="plan_color" id="plan_color">
                    <option value="blue" <?php selected($color, 'blue'); ?>>Blue (Standard)</option>
                    <option value="orange" <?php selected($color, 'orange'); ?>>Orange (Premium)</option>
                    <option value="purple" <?php selected($color, 'purple'); ?>>Purple (Dedicated)</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="plan_is_recommended">Most Popular?</label></th>
            <td><input type="checkbox" name="plan_is_recommended" id="plan_is_recommended" value="1" <?php checked($is_recommended, '1'); ?>> Yes, show "Most Popular" tag</td>
        </tr>
        <tr>
            <th><label for="plan_features">Features (One per line)</label></th>
            <td><textarea name="plan_features" id="plan_features" rows="5" class="large-text"><?php echo esc_textarea($features); ?></textarea></td>
        </tr>
    </table>
    <?php
}

function jannat_it_save_plan_meta( $post_id ) {
    if ( isset( $_POST['plan_monthly_price'] ) ) update_post_meta( $post_id, '_plan_monthly_price', sanitize_text_field( $_POST['plan_monthly_price'] ) );
    if ( isset( $_POST['plan_yearly_price'] ) ) update_post_meta( $post_id, '_plan_yearly_price', sanitize_text_field( $_POST['plan_yearly_price'] ) );
    if ( isset( $_POST['plan_whmcs_pid'] ) ) update_post_meta( $post_id, '_plan_whmcs_pid', sanitize_text_field( $_POST['plan_whmcs_pid'] ) );
    if ( isset( $_POST['plan_features'] ) ) update_post_meta( $post_id, '_plan_features', sanitize_textarea_field( $_POST['plan_features'] ) );
    if ( isset( $_POST['plan_color'] ) ) update_post_meta( $post_id, '_plan_color', sanitize_text_field( $_POST['plan_color'] ) );
    if ( isset( $_POST['plan_spec_cpu'] ) ) update_post_meta( $post_id, '_plan_spec_cpu', sanitize_text_field( $_POST['plan_spec_cpu'] ) );
    if ( isset( $_POST['plan_spec_ram'] ) ) update_post_meta( $post_id, '_plan_spec_ram', sanitize_text_field( $_POST['plan_spec_ram'] ) );
    if ( isset( $_POST['plan_spec_storage'] ) ) update_post_meta( $post_id, '_plan_spec_storage', sanitize_text_field( $_POST['plan_spec_storage'] ) );
    if ( isset( $_POST['plan_spec_port'] ) ) update_post_meta( $post_id, '_plan_spec_port', sanitize_text_field( $_POST['plan_spec_port'] ) );
    if ( isset( $_POST['plan_spec_ip'] ) ) update_post_meta( $post_id, '_plan_spec_ip', sanitize_text_field( $_POST['plan_spec_ip'] ) );
    if ( isset( $_POST['plan_spec_os'] ) ) update_post_meta( $post_id, '_plan_spec_os', sanitize_text_field( $_POST['plan_spec_os'] ) );
    
    $is_recommended = isset( $_POST['plan_is_recommended'] ) ? '1' : '0';
    update_post_meta( $post_id, '_plan_is_recommended', $is_recommended );
}
add_action( 'save_post', 'jannat_it_save_plan_meta' );

/**
 * Phase 3: WHMCS API Settings Page
 */
function jannat_it_add_settings_page() {
    add_menu_page(
        'Jannat IT Settings',
        'Jannat IT Settings',
        'manage_options',
        'jannat-it-settings',
        'jannat_it_render_settings_page',
        'dashicons-admin-generic',
        100
    );
}
add_action( 'admin_menu', 'jannat_it_add_settings_page' );

function jannat_it_render_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) return;
    
    if ( isset( $_POST['jannat_it_save_settings'] ) ) {
        update_option( 'jannat_it_whmcs_url', sanitize_text_field( $_POST['whmcs_url'] ) );
        update_option( 'jannat_it_whmcs_api_url', sanitize_text_field( $_POST['whmcs_api_url'] ) );
        update_option( 'jannat_it_whmcs_identifier', sanitize_text_field( $_POST['whmcs_identifier'] ) );
        update_option( 'jannat_it_whmcs_secret', sanitize_text_field( $_POST['whmcs_secret'] ) );
        echo '<div class="updated"><p>Settings saved successfully!</p></div>';
    }

    $whmcs_url = get_option( 'jannat_it_whmcs_url', '' );
    $whmcs_api_url = get_option( 'jannat_it_whmcs_api_url', '' );
    $whmcs_identifier = get_option( 'jannat_it_whmcs_identifier', '' );
    $whmcs_secret = get_option( 'jannat_it_whmcs_secret', '' );

    ?>
    <div class="wrap">
        <h1>Jannat IT Premium Settings</h1>
        <form method="post" action="">
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="whmcs_url">WHMCS Base URL</label></th>
                    <td><input name="whmcs_url" type="text" id="whmcs_url" value="<?php echo esc_attr($whmcs_url); ?>" class="regular-text" placeholder="https://billing.yourdomain.com"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="whmcs_api_url">WHMCS API URL</label></th>
                    <td><input name="whmcs_api_url" type="text" id="whmcs_api_url" value="<?php echo esc_attr($whmcs_api_url); ?>" class="regular-text" placeholder="https://billing.yourdomain.com/includes/api.php"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="whmcs_identifier">API Identifier</label></th>
                    <td><input name="whmcs_identifier" type="text" id="whmcs_identifier" value="<?php echo esc_attr($whmcs_identifier); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="whmcs_secret">API Secret</label></th>
                    <td><input name="whmcs_secret" type="password" id="whmcs_secret" value="<?php echo esc_attr($whmcs_secret); ?>" class="regular-text"></td>
                </tr>
            </table>
            <p class="submit">
                <input type="submit" name="jannat_it_save_settings" id="submit" class="button button-primary" value="Save Changes">
            </p>
        </form>
    </div>
    <?php
}

/**
 * Phase 3: WHMCS API Wrapper (PHP Version of server.ts logic)
 */
function jannat_it_call_whmcs( $action, $params = array() ) {
    $api_url = get_option( 'jannat_it_whmcs_api_url' );
    $identifier = get_option( 'jannat_it_whmcs_identifier' );
    $secret = get_option( 'jannat_it_whmcs_secret' );

    if ( ! $api_url || ! $identifier || ! $secret ) {
        return array( 'result' => 'error', 'message' => 'API credentials not configured.' );
    }

    $post_fields = array_merge( array(
        'action'     => $action,
        'identifier' => $identifier,
        'secret'     => $secret,
        'responsetype' => 'json',
    ), $params );

    $response = wp_remote_post( $api_url, array(
        'body' => $post_fields,
    ) );

    if ( is_wp_error( $response ) ) {
        return array( 'result' => 'error', 'message' => $response->get_error_message() );
    }

    return json_decode( wp_remote_retrieve_body( $response ), true );
}

/**
 * Phase 4: Custom Login Styling
 */
function jannat_it_login_styling() {
    ?>
    <style type="text/css">
        body.login {
            background-color: #050506 !important;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #login h1 a, .login h1 a {
            background-image: none !important;
            text-indent: 0 !important;
            width: auto !important;
            height: auto !important;
            color: #fff !important;
            font-size: 32px !important;
            font-weight: 900 !important;
            letter-spacing: -2px !important;
            margin-bottom: 30px !important;
        }
        #login h1 a::before {
            content: 'Jannat ';
        }
        #login h1 a::after {
            content: 'IT';
            color: #f97316;
        }
        .login form {
            background: rgba(255, 255, 255, 0.03) !important;
            backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            border-radius: 24px !important;
            padding: 40px !important;
        }
        .login label {
            color: #94a3b8 !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            font-size: 10px !important;
        }
        .login input[type="text"], .login input[type="password"] {
            background: rgba(255, 255, 255, 0.03) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 12px !important;
            color: #fff !important;
            padding: 12px !important;
        }
        .wp-core-ui .button-primary {
            background: #ea580c !important;
            border: none !important;
            border-radius: 12px !important;
            padding: 10px 30px !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            height: auto !important;
            box-shadow: 0 10px 30px rgba(234, 88, 12, 0.3) !important;
        }
    </style>
    <?php
}
add_action( 'login_enqueue_scripts', 'jannat_it_login_styling' );

/**
 * Phase 4: Sync User with WHMCS on Login/Registration
 */
function jannat_it_sync_with_whmcs( $user_login, $user ) {
    $email = $user->user_email;
    $first_name = $user->first_name ?: 'User';
    $last_name = $user->last_name ?: 'Jannat IT';

    // Check if user already exists in WHMCS
    $check = jannat_it_call_whmcs('GetClientsDetails', array('email' => $email));
    
    if ($check['result'] !== 'success') {
        // Create client in WHMCS if not exists
        jannat_it_call_whmcs('AddClient', array(
            'firstname' => $first_name,
            'lastname'  => $last_name,
            'email'     => $email,
            'password'  => wp_generate_password(12),
            'address1'  => 'Cloud User',
            'city'      => 'Online',
            'state'     => 'Global',
            'postcode'  => '0000',
            'country'   => 'BD',
            'phonenumber' => '0000000000'
        ));
    }
}
add_action( 'wp_login', 'jannat_it_sync_with_whmcs', 10, 2 );

/**
 * Final Launch Fixes: Redirect Handler for /configure/PID
 */
function jannat_it_add_rewrite_rules() {
    add_rewrite_rule('^configure/([^/]+)/?', 'index.php?whmcs_pid=$matches[1]', 'top');
}
add_action('init', 'jannat_it_add_rewrite_rules');

function jannat_it_add_query_vars($vars) {
    $vars[] = 'whmcs_pid';
    return $vars;
}
add_filter('query_vars', 'jannat_it_add_query_vars');

function jannat_it_handle_configure_redirect() {
    $pid = get_query_var('whmcs_pid');
    if ($pid) {
        $whmcs_url = get_option('jannat_it_whmcs_url');
        if ($whmcs_url) {
            // Redirect to WHMCS cart with specific PID
            $checkout_url = trailingslashit($whmcs_url) . 'cart.php?a=add&pid=' . $pid;
            wp_redirect($checkout_url);
            exit;
        }
    }
}
add_action('template_redirect', 'jannat_it_handle_configure_redirect');

/**
 * Final Launch Fixes: Domain Search Handler (AJAX)
 */
function jannat_it_domain_search() {
    $domain = sanitize_text_field($_POST['domain']);
    $whmcs_url = get_option('jannat_it_whmcs_url');
    
    if (!$domain || !$whmcs_url) {
        wp_send_json_error('Invalid domain or WHMCS not configured.');
    }

    // Direct redirect to WHMCS domain search for simplicity and better UX
    $search_url = trailingslashit($whmcs_url) . 'cart.php?a=add&domain=register&query=' . urlencode($domain);
    wp_send_json_success(array('redirect_url' => $search_url));
}
add_action('wp_ajax_domain_search', 'jannat_it_domain_search');
add_action('wp_ajax_nopriv_domain_search', 'jannat_it_domain_search');

/**
 * Final Launch Fixes: Basic SMTP Configuration
 * Note: Replace these with real data in WP admin or use a plugin like WP Mail SMTP
 */
function jannat_it_smtp_setup($phpmailer) {
    $phpmailer->isSMTP();
    $phpmailer->Host       = 'mail.yourdomain.com'; // Your SMTP Host
    $phpmailer->SMTPAuth   = true;
    $phpmailer->Port       = 465;
    $phpmailer->Username   = 'noreply@yourdomain.com'; // Your SMTP Username
    $phpmailer->Password   = 'your_password'; // Your SMTP Password
    $phpmailer->SMTPSecure = 'ssl';
    $phpmailer->From       = 'noreply@yourdomain.com';
    $phpmailer->FromName   = 'Jannat IT';
}
// add_action('phpmailer_init', 'jannat_it_smtp_setup'); // Uncomment and fill details to use

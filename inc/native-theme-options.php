<?php
/**
 * Native Theme Options (Fallback if ACF Pro is not installed)
 */

function jannat_it_register_native_settings() {
    register_setting('jannat_it_settings_group', 'options_support_email');
    register_setting('jannat_it_settings_group', 'options_phone_number');
    register_setting('jannat_it_settings_group', 'options_office_address');
    register_setting('jannat_it_settings_group', 'options_promo_text');
    register_setting('jannat_it_settings_group', 'options_promo_link');
    register_setting('jannat_it_settings_group', 'options_whmcs_url');
    register_setting('jannat_it_settings_group', 'options_client_login_url');
    register_setting('jannat_it_settings_group', 'options_header_button_url');
    register_setting('jannat_it_settings_group', 'options_social_facebook');
    register_setting('jannat_it_settings_group', 'options_social_twitter');
    register_setting('jannat_it_settings_group', 'options_social_linkedin');
    register_setting('jannat_it_settings_group', 'options_social_telegram');
    register_setting('jannat_it_settings_group', 'options_social_whatsapp');
}
add_action('admin_init', 'jannat_it_register_native_settings');

function jannat_it_add_settings_page() {
    add_menu_page(
        'Jannat IT Settings',
        'Theme Options',
        'manage_options',
        'jannat-it-settings',
        'jannat_it_settings_page_html',
        'dashicons-admin-generic',
        58
    );
}
add_action('admin_menu', 'jannat_it_add_settings_page');

function jannat_it_settings_page_html() {
    if (!current_user_can('manage_options')) return;
    ?>
    <div class="wrap">
        <h1>Jannat IT Theme Options</h1>
        <form action="options.php" method="post">
            <?php settings_fields('jannat_it_settings_group'); ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Support Email</th>
                    <td><input type="text" name="options_support_email" value="<?php echo esc_attr(get_option('options_support_email')); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Phone Number</th>
                    <td><input type="text" name="options_phone_number" value="<?php echo esc_attr(get_option('options_phone_number')); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Office Address</th>
                    <td><textarea name="options_office_address" rows="3" class="large-text"><?php echo esc_textarea(get_option('options_office_address')); ?></textarea></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Promo Banner Text</th>
                    <td><input type="text" name="options_promo_text" value="<?php echo esc_attr(get_option('options_promo_text')); ?>" class="large-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Promo Banner Link</th>
                    <td><input type="text" name="options_promo_link" value="<?php echo esc_attr(get_option('options_promo_link')); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">WHMCS Base URL</th>
                    <td><input type="text" name="options_whmcs_url" value="<?php echo esc_attr(get_option('options_whmcs_url')); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Client Login URL</th>
                    <td><input type="text" name="options_client_login_url" value="<?php echo esc_attr(get_option('options_client_login_url')); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Header "Deploy Server" URL</th>
                    <td><input type="text" name="options_header_button_url" value="<?php echo esc_attr(get_option('options_header_button_url')); ?>" class="regular-text" /></td>
                </tr>
                
                <tr valign="top"><th scope="row" colspan="2"><h3>Social Links</h3></th></tr>
                <tr valign="top">
                    <th scope="row">Facebook URL</th>
                    <td><input type="text" name="options_social_facebook" value="<?php echo esc_attr(get_option('options_social_facebook')); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Twitter URL</th>
                    <td><input type="text" name="options_social_twitter" value="<?php echo esc_attr(get_option('options_social_twitter')); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">LinkedIn URL</th>
                    <td><input type="text" name="options_social_linkedin" value="<?php echo esc_attr(get_option('options_social_linkedin')); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Telegram URL</th>
                    <td><input type="text" name="options_social_telegram" value="<?php echo esc_attr(get_option('options_social_telegram')); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">WhatsApp URL</th>
                    <td><input type="text" name="options_social_whatsapp" value="<?php echo esc_attr(get_option('options_social_whatsapp')); ?>" class="regular-text" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

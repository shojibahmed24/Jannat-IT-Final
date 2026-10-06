<?php
/**
 * Register ACF Theme Options Page and Fields dynamically
 */

function jannat_it_acf_init() {
    // Check if ACF is installed
    if ( function_exists('acf_add_options_page') ) {
        
        // Register Options Page
        acf_add_options_page(array(
            'page_title'    => 'Jannat IT Settings',
            'menu_title'    => 'Theme Options',
            'menu_slug'     => 'jannat-it-settings',
            'capability'    => 'edit_posts',
            'redirect'      => false,
            'icon_url'      => 'dashicons-admin-generic',
        ));

        // Register Fields Natively via PHP (No manual creation needed by the user)
        acf_add_local_field_group(array(
            'key' => 'group_jannat_it_theme_options',
            'title' => 'Global Theme Options',
            'fields' => array(
                // Tab: General Info
                array(
                    'key' => 'field_tab_general',
                    'label' => 'General Info',
                    'type' => 'tab',
                ),
                array(
                    'key' => 'field_support_email',
                    'label' => 'Support Email',
                    'name' => 'support_email',
                    'type' => 'email',
                ),
                array(
                    'key' => 'field_phone_number',
                    'label' => 'Phone Number',
                    'name' => 'phone_number',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_office_address',
                    'label' => 'Office Address',
                    'name' => 'office_address',
                    'type' => 'textarea',
                ),
                
                // Tab: Header Promo
                array(
                    'key' => 'field_tab_promo',
                    'label' => 'Header Promo Banner',
                    'type' => 'tab',
                ),
                array(
                    'key' => 'field_promo_text',
                    'label' => 'Promo Text',
                    'name' => 'promo_text',
                    'type' => 'text',
                    'default_value' => 'Limited-time offer — save up to 55% on annual VPS plans',
                ),
                array(
                    'key' => 'field_promo_link',
                    'label' => 'Promo Link / URL',
                    'name' => 'promo_link',
                    'type' => 'url',
                ),

                // Tab: WHMCS & Billing
                array(
                    'key' => 'field_tab_billing',
                    'label' => 'WHMCS & Billing',
                    'type' => 'tab',
                ),
                array(
                    'key' => 'field_whmcs_url',
                    'label' => 'WHMCS Base URL',
                    'name' => 'whmcs_url',
                    'type' => 'url',
                    'instructions' => 'e.g., https://billing.jannatit.com',
                ),
                array(
                    'key' => 'field_client_login_url',
                    'label' => 'Client Login URL',
                    'name' => 'client_login_url',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_support_ticket_url',
                    'label' => 'Support Ticket URL',
                    'name' => 'support_ticket_url',
                    'type' => 'url',
                ),

                // Tab: Social Links
                array(
                    'key' => 'field_tab_social',
                    'label' => 'Social Links',
                    'type' => 'tab',
                ),
                array(
                    'key' => 'field_social_facebook',
                    'label' => 'Facebook URL',
                    'name' => 'social_facebook',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_social_twitter',
                    'label' => 'Twitter / X URL',
                    'name' => 'social_twitter',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_social_linkedin',
                    'label' => 'LinkedIn URL',
                    'name' => 'social_linkedin',
                    'type' => 'url',
                ),

                // Tab: API Keys
                array(
                    'key' => 'field_tab_api',
                    'label' => 'API Keys & Scripts',
                    'type' => 'tab',
                ),
                array(
                    'key' => 'field_tawkto_id',
                    'label' => 'Tawk.to Property ID',
                    'name' => 'tawkto_id',
                    'type' => 'text',
                    'instructions' => 'Enter your Tawk.to direct chat link ID or property ID.',
                ),
                // Tab: Domain Pricing
                array(
                    'key' => 'field_tab_domains',
                    'label' => 'Domain Pricing',
                    'type' => 'tab',
                ),
                array(
                    'key' => 'field_domain_pricing',
                    'label' => 'Domain Extensions & Prices',
                    'name' => 'domain_pricing',
                    'type' => 'repeater',
                    'layout' => 'table',
                    'button_label' => 'Add Domain TLD',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_domain_tld',
                            'label' => 'TLD (Extension)',
                            'name' => 'tld',
                            'type' => 'text',
                            'placeholder' => '.com',
                        ),
                        array(
                            'key' => 'field_domain_reg',
                            'label' => 'Registration Price',
                            'name' => 'registration',
                            'type' => 'text',
                            'placeholder' => '$9.99',
                        ),
                        array(
                            'key' => 'field_domain_ren',
                            'label' => 'Renewal Price',
                            'name' => 'renewal',
                            'type' => 'text',
                        ),
                        array(
                            'key' => 'field_domain_trans',
                            'label' => 'Transfer Price',
                            'name' => 'transfer',
                            'type' => 'text',
                        ),
                        array(
                            'key' => 'field_domain_badge',
                            'label' => 'Badge Color',
                            'name' => 'badge_color',
                            'type' => 'select',
                            'choices' => array(
                                'orange' => 'Orange',
                                'blue' => 'Blue',
                                'purple' => 'Purple',
                                'green' => 'Green',
                                'slate' => 'Slate',
                            ),
                            'default_value' => 'slate',
                        ),
                    ),
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'options_page',
                        'operator' => '==',
                        'value' => 'jannat-it-settings',
                    ),
                ),
            ),
        ));
    }
}
add_action('acf/init', 'jannat_it_acf_init');

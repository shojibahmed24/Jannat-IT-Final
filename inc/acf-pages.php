<?php
/**
 * Register ACF Fields for Specific Pages (Home, About)
 */

function jannat_it_acf_pages_init() {
    if ( !function_exists('acf_add_local_field_group') ) return;

    // Homepage Fields
    acf_add_local_field_group(array(
        'key' => 'group_home_page',
        'title' => 'Homepage Settings',
        'fields' => array(
            array(
                'key' => 'field_home_hero_title',
                'label' => 'Hero Title',
                'name' => 'hero_title',
                'type' => 'text',
                'default_value' => 'Next-Generation Cloud Infrastructure',
            ),
            array(
                'key' => 'field_home_hero_subtitle',
                'label' => 'Hero Subtitle',
                'name' => 'hero_subtitle',
                'type' => 'textarea',
                'default_value' => 'Deploy high-performance VPS, RDP, and Dedicated servers instantly with enterprise-grade security and 99.99% uptime guarantee.',
            ),
            array(
                'key' => 'field_home_hero_btn_text',
                'label' => 'Button Text',
                'name' => 'hero_button_text',
                'type' => 'text',
                'default_value' => 'Deploy Now',
            ),
            array(
                'key' => 'field_home_features',
                'label' => 'Features (Why Choose Us)',
                'name' => 'features',
                'type' => 'repeater',
                'layout' => 'block',
                'button_label' => 'Add Feature',
                'sub_fields' => array(
                    array(
                        'key' => 'field_feat_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                    ),
                    array(
                        'key' => 'field_feat_desc',
                        'label' => 'Description',
                        'name' => 'description',
                        'type' => 'textarea',
                    ),
                    array(
                        'key' => 'field_feat_icon',
                        'label' => 'Icon Name',
                        'name' => 'icon',
                        'type' => 'select',
                        'choices' => array(
                            'Zap' => 'Lightning / Fast',
                            'Shield' => 'Shield / Security',
                            'Globe' => 'Globe / Network',
                            'Server' => 'Server / Hardware',
                            'Cpu' => 'CPU / Processing',
                        ),
                        'default_value' => 'Zap',
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'page',
                    'operator' => '==',
                    'value' => get_option('page_on_front') ?: '2', // Fallback ID if front page not set
                ),
            ),
            array(
                array(
                    'param' => 'page_template',
                    'operator' => '==',
                    'value' => 'default', // Ideally assigned by slug or front_page but we keep it broad for demo
                ),
            )
        ),
    ));

    // About Us Page Fields
    acf_add_local_field_group(array(
        'key' => 'group_about_page',
        'title' => 'About Page Settings',
        'fields' => array(
            array(
                'key' => 'field_about_counters',
                'label' => 'Stats Counters',
                'name' => 'counters',
                'type' => 'repeater',
                'layout' => 'table',
                'button_label' => 'Add Counter',
                'sub_fields' => array(
                    array(
                        'key' => 'field_counter_value',
                        'label' => 'Value (Number)',
                        'name' => 'value',
                        'type' => 'number',
                    ),
                    array(
                        'key' => 'field_counter_suffix',
                        'label' => 'Suffix (e.g. + or %)',
                        'name' => 'suffix',
                        'type' => 'text',
                    ),
                    array(
                        'key' => 'field_counter_label',
                        'label' => 'Label',
                        'name' => 'label',
                        'type' => 'text',
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'page',
                    'operator' => '==',
                    'value' => '3', // Dummy ID, usually you filter by page title/slug in production
                ),
            ),
        ),
    ));
}
add_action('acf/init', 'jannat_it_acf_pages_init');

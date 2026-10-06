<?php
/**
 * Register ACF Fields for Hosting Plans (Repeater for Specs)
 */
function jannat_it_acf_hosting_plans_init() {
    if ( !function_exists('acf_add_local_field_group') ) return;

    acf_add_local_field_group(array(
        'key' => 'group_hosting_plan_details',
        'title' => 'Advanced Plan Details (ACF)',
        'fields' => array(
            array(
                'key' => 'field_plan_specifications',
                'label' => 'Plan Specifications',
                'name' => 'plan_specifications',
                'type' => 'repeater',
                'instructions' => 'Add server specifications here. The frontend will automatically detect the correct icon based on keywords (e.g. "RAM", "CPU", "NVMe"). You can drag and drop to reorder.',
                'required' => 0,
                'collapsed' => 'field_spec_feature_text',
                'min' => 0,
                'max' => 0,
                'layout' => 'table',
                'button_label' => 'Add Specification',
                'sub_fields' => array(
                    array(
                        'key' => 'field_spec_feature_text',
                        'label' => 'Feature Text',
                        'name' => 'feature_text',
                        'type' => 'text',
                        'instructions' => 'e.g., "4 vCPU Cores", "8GB RAM", "10Gbps Network"',
                        'required' => 1,
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'hosting_plan',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => '',
    ));
}
add_action('acf/init', 'jannat_it_acf_hosting_plans_init');

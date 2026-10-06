<?php
/**
 * Register Custom Post Types and Taxonomies
 */

function jannat_it_register_cpt() {
    // Hosting Plans Post Type
    $labels = array(
        'name'               => 'Hosting Plans',
        'singular_name'      => 'Hosting Plan',
        'menu_name'          => 'Hosting Plans',
        'add_new'            => 'Add New Plan',
        'add_new_item'       => 'Add New Hosting Plan',
        'edit_item'          => 'Edit Plan',
        'new_item'           => 'New Plan',
        'view_item'          => 'View Plan',
        'search_items'       => 'Search Plans',
        'not_found'          => 'No plans found',
        'not_found_in_trash' => 'No plans found in Trash',
    );

    $args = array(
        'labels'              => $labels,
        'public'              => true,
        'has_archive'         => false,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true, // Essential for REST API
        'rest_base'           => 'hosting-plans',
        'menu_icon'           => 'dashicons-cloud',
        'supports'            => array( 'title', 'custom-fields' ), // Title is the plan name. Custom fields for specs.
    );

    register_post_type( 'hosting_plan', $args );

    // Hosting Category Taxonomy (e.g. VPS, RDP, Dedicated)
    $tax_labels = array(
        'name'              => 'Plan Categories',
        'singular_name'     => 'Plan Category',
        'search_items'      => 'Search Categories',
        'all_items'         => 'All Categories',
        'edit_item'         => 'Edit Category',
        'update_item'       => 'Update Category',
        'add_new_item'      => 'Add New Category',
        'new_item_name'     => 'New Category Name',
        'menu_name'         => 'Categories',
    );

    $tax_args = array(
        'hierarchical'      => true,
        'labels'            => $tax_labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'query_var'         => true,
    );

    register_taxonomy( 'plan_category', array( 'hosting_plan' ), $tax_args );

    // FAQ Post Type
    register_post_type( 'faq', array(
        'labels'              => array(
            'name'          => 'FAQs',
            'singular_name' => 'FAQ',
            'menu_name'     => 'FAQs',
            'add_new'       => 'Add New FAQ',
        ),
        'public'              => true,
        'has_archive'         => false,
        'show_ui'             => true,
        'show_in_rest'        => true,
        'rest_base'           => 'faqs',
        'menu_icon'           => 'dashicons-editor-help',
        'supports'            => array( 'title', 'editor' ), // Title is question, Editor is answer
    ) );

    // Testimonial Post Type
    register_post_type( 'testimonial', array(
        'labels'              => array(
            'name'          => 'Testimonials',
            'singular_name' => 'Testimonial',
            'menu_name'     => 'Testimonials',
            'add_new'       => 'Add Testimonial',
        ),
        'public'              => true,
        'has_archive'         => false,
        'show_ui'             => true,
        'show_in_rest'        => true,
        'rest_base'           => 'testimonials',
        'menu_icon'           => 'dashicons-format-quote',
        'supports'            => array( 'title', 'editor', 'custom-fields', 'thumbnail' ),
    ) );

    // Contact Messages Post Type
    register_post_type( 'jannat_message', array(
        'labels'              => array(
            'name'          => 'Messages',
            'singular_name' => 'Message',
            'menu_name'     => 'Messages',
            'all_items'     => 'All Messages',
            'add_new'       => 'New Message',
        ),
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'menu_position'       => 26,
        'menu_icon'           => 'dashicons-email',
        'supports'            => array( 'title', 'editor', 'custom-fields' ),
        'capabilities'        => array(
            'create_posts' => 'do_not_allow' // Only API can create
        ),
        'map_meta_cap'        => true,
    ) );

}
add_action( 'init', 'jannat_it_register_cpt' );

<?php
/**
 * Register native Meta Boxes as a fallback if ACF is not used.
 * This makes the theme fully functional out-of-the-box.
 */

function jannat_it_add_meta_boxes() {
    // Hosting Plans
    add_meta_box(
        'hosting_plan_details',
        'Hosting Plan Details',
        'jannat_it_hosting_meta_box_html',
        'hosting_plan',
        'normal',
        'high'
    );

    // Testimonials
    add_meta_box(
        'testimonial_details',
        'Testimonial Details',
        'jannat_it_testimonial_meta_box_html',
        'testimonial',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'jannat_it_add_meta_boxes' );

function jannat_it_hosting_meta_box_html( $post ) {
    $price_monthly = get_post_meta( $post->ID, 'price_monthly', true );
    $price_yearly  = get_post_meta( $post->ID, 'price_yearly', true );
    $old_price     = get_post_meta( $post->ID, 'old_price', true );
    $specs         = get_post_meta( $post->ID, 'specs', true );
    $is_popular    = get_post_meta( $post->ID, 'is_popular', true );
    $whmcs_link    = get_post_meta( $post->ID, 'whmcs_link', true );
    ?>
    <p>
        <label for="price_monthly"><strong>Monthly Price:</strong></label><br>
        <input type="text" id="price_monthly" name="price_monthly" value="<?php echo esc_attr( $price_monthly ); ?>" style="width:100%">
    </p>
    <p>
        <label for="price_yearly"><strong>Yearly Price:</strong></label><br>
        <input type="text" id="price_yearly" name="price_yearly" value="<?php echo esc_attr( $price_yearly ); ?>" style="width:100%">
    </p>
    <p>
        <label for="old_price"><strong>Old Price (Crossed out):</strong></label><br>
        <input type="text" id="old_price" name="old_price" value="<?php echo esc_attr( $old_price ); ?>" style="width:100%">
    </p>
    <p>
        <label for="specs"><strong>Specs (Comma separated):</strong></label><br>
        <input type="text" id="specs" name="specs" value="<?php echo esc_attr( $specs ); ?>" placeholder="2 vCPU, 4GB RAM, 80GB NVMe" style="width:100%">
    </p>
    
    <p>
        <label for="whmcs_link"><strong>WHMCS Order URL:</strong></label><br>
        <input type="url" id="whmcs_link" name="whmcs_link" value="<?php echo esc_attr( $whmcs_link ); ?>" placeholder="https://my.jannatit.net/cart.php?a=add&pid=1" style="width:100%">
    </p>
    <p>
        <label for="is_popular">
            <input type="checkbox" id="is_popular" name="is_popular" value="yes" <?php checked( $is_popular, 'yes' ); ?>>
            <strong>Mark as Popular / Recommended</strong>
        </label>
    </p>
    <?php
}

function jannat_it_testimonial_meta_box_html( $post ) {
    $role = get_post_meta( $post->ID, 'role', true );
    ?>
    <p>
        <label for="role"><strong>Client Role / Company:</strong></label><br>
        <input type="text" id="role" name="role" value="<?php echo esc_attr( $role ); ?>" style="width:100%">
    </p>
    <?php
}

function jannat_it_save_meta_boxes( $post_id ) {
    // Save Hosting Plan Meta
    if ( isset( $_POST['price_monthly'] ) ) {
        update_post_meta( $post_id, 'price_monthly', sanitize_text_field( $_POST['price_monthly'] ) );
    }
    if ( isset( $_POST['price_yearly'] ) ) {
        update_post_meta( $post_id, 'price_yearly', sanitize_text_field( $_POST['price_yearly'] ) );
    }
    if ( isset( $_POST['old_price'] ) ) {
        update_post_meta( $post_id, 'old_price', sanitize_text_field( $_POST['old_price'] ) );
    }
    if ( isset( $_POST['specs'] ) ) {
        update_post_meta( $post_id, 'specs', sanitize_text_field( $_POST['specs'] ) );
    }
    
    if ( isset( $_POST['whmcs_link'] ) ) {
        update_post_meta( $post_id, 'whmcs_link', sanitize_text_field( $_POST['whmcs_link'] ) );
    }
    
    // Checkbox needs special handling
    if ( get_post_type($post_id) === 'hosting_plan' ) {
        $is_popular = isset( $_POST['is_popular'] ) ? 'yes' : 'no';
        update_post_meta( $post_id, 'is_popular', $is_popular );
    }

    // Save Testimonial Meta
    if ( isset( $_POST['role'] ) ) {
        update_post_meta( $post_id, 'role', sanitize_text_field( $_POST['role'] ) );
    }
}
add_action( 'save_post', 'jannat_it_save_meta_boxes' );

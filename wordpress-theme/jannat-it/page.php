<?php get_header(); ?>

<main id="primary" class="site-main py-20 lg:py-32">
    <div class="container mx-auto px-6">
        <?php
        while ( have_posts() ) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header mb-12">
                    <?php the_title( '<h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">', '</h1>' ); ?>
                    <?php if ( has_excerpt() ) : ?>
                        <div class="text-xl text-slate-400 font-medium max-w-3xl leading-relaxed">
                            <?php the_excerpt(); ?>
                        </div>
                    <?php endif; ?>
                </header>

                <div class="entry-content text-slate-400 leading-relaxed max-w-none">
                    <?php
                    the_content();

                    wp_link_pages(
                        array(
                            'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'jannat-it' ),
                            'after'  => '</div>',
                        )
                    );
                    ?>
                </div>
            </article>
            <?php
        endwhile;
        ?>
    </div>
</main>

<?php get_footer(); ?>

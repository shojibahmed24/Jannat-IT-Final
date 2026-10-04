<?php get_header(); ?>

<main id="primary" class="site-main py-20">
    <div class="container mx-auto px-6">
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) : the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <header class="entry-header mb-10">
                        <?php the_title( '<h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">', '</h1>' ); ?>
                    </header>

                    <div class="entry-content text-slate-400 leading-relaxed max-w-4xl">
                        <?php the_content(); ?>
                    </div>
                </article>
                <?php
            endwhile;
        else :
            ?>
            <section class="no-results not-found text-center py-20">
                <h2 class="text-3xl font-bold text-white mb-4">Nothing Found</h2>
                <p class="text-slate-500">It looks like nothing was found at this location.</p>
            </section>
            <?php
        endif;
        ?>
    </div>
</main>

<?php get_footer(); ?>

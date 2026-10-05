<?php get_header(); ?>

<main class="bg-[#050506] py-24">
    <div class="max-w-7xl mx-auto px-6">
        <header class="mb-20 text-center" data-aos="fade-up">
            <h1 class="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">Insights & Updates</h1>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Stay updated with the latest in cloud technology, hosting tips, and company news.
            </p>
        </header>

        <?php if ( have_posts() ) : ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php while ( have_posts() ) : the_post(); ?>
                    <article class="group bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-2 flex flex-col" data-aos="fade-up">
                        <!-- Post Thumbnail -->
                        <a href="<?php the_permalink(); ?>" class="block aspect-[16/10] overflow-hidden relative">
                            <?php if ( has_post_thumbnail() ) : ?>
                                <?php the_post_thumbnail('large', ['class' => 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110']); ?>
                            <?php else : ?>
                                <div class="w-full h-full bg-gradient-to-br from-orange-600/20 to-blue-600/20 flex items-center justify-center">
                                    <i data-lucide="image" class="w-12 h-12 text-white/20"></i>
                                </div>
                            <?php endif; ?>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </a>

                        <!-- Post Content -->
                        <div class="p-8 flex-1 flex flex-col">
                            <div class="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-widest text-orange-500">
                                <span><?php echo get_the_date(); ?></span>
                                <span class="w-1 h-1 bg-white/20 rounded-full"></span>
                                <span><?php the_category(', '); ?></span>
                            </div>
                            
                            <h2 class="text-2xl font-black text-white mb-4 group-hover:text-orange-500 transition-colors">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h2>
                            
                            <div class="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
                                <?php echo wp_trim_words( get_the_excerpt(), 25 ); ?>
                            </div>

                            <div class="mt-auto">
                                <a href="<?php the_permalink(); ?>" class="inline-flex items-center gap-2 text-sm font-black text-white hover:text-orange-500 transition-colors uppercase tracking-widest">
                                    Read Article
                                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                </a>
                            </div>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <!-- Pagination -->
            <div class="mt-20 flex justify-center">
                <?php
                the_posts_pagination( array(
                    'prev_text' => '<i data-lucide="chevron-left" class="w-5 h-5"></i>',
                    'next_text' => '<i data-lucide="chevron-right" class="w-5 h-5"></i>',
                    'class'     => 'pagination-nav',
                ) );
                ?>
            </div>

        <?php else : ?>
            <div class="text-center py-20">
                <p class="text-slate-400 text-xl font-medium">No posts found. Please check back later!</p>
            </div>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>

<?php get_header(); ?>

<main class="bg-[#050506] pb-24">
    <?php while ( have_posts() ) : the_post(); ?>
        <!-- Hero Header -->
        <header class="relative pt-32 pb-20 overflow-hidden">
            <div class="absolute inset-0 z-0">
                <?php if ( has_post_thumbnail() ) : ?>
                    <?php the_post_thumbnail('full', ['class' => 'w-full h-full object-cover opacity-20 blur-xl scale-110']); ?>
                <?php endif; ?>
                <div class="absolute inset-0 bg-gradient-to-b from-[#050506] via-transparent to-[#050506]"></div>
            </div>

            <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <div class="flex items-center justify-center gap-4 mb-8 text-xs font-bold uppercase tracking-[0.3em] text-orange-500" data-aos="fade-up">
                    <span><?php echo get_the_date(); ?></span>
                    <span class="w-1.5 h-1.5 bg-orange-500/20 rounded-full"></span>
                    <span><?php the_category(', '); ?></span>
                </div>
                
                <h1 class="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight" data-aos="fade-up">
                    <?php the_title(); ?>
                </h1>

                <div class="flex items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="100">
                    <div class="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <i data-lucide="user" class="w-6 h-6 text-slate-400"></i>
                    </div>
                    <div class="text-left">
                        <p class="text-xs font-black text-white uppercase tracking-widest"><?php the_author(); ?></p>
                        <p class="text-[10px] text-slate-500 font-bold uppercase">Author</p>
                    </div>
                </div>
            </div>
        </header>

        <!-- Content Area -->
        <div class="max-w-4xl mx-auto px-6">
            <article class="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden" data-aos="fade-up">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
                
                <!-- Featured Image -->
                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5">
                        <?php the_post_thumbnail('full', ['class' => 'w-full h-auto']); ?>
                    </div>
                <?php endif; ?>

                <!-- Article Content -->
                <div class="prose prose-invert prose-orange max-w-none 
                    prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-white
                    prose-p:text-slate-400 prose-p:text-lg prose-p:leading-relaxed
                    prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-black
                    prose-img:rounded-2xl prose-img:border prose-img:border-white/5
                    prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-white/[0.02] prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-white">
                    <?php the_content(); ?>
                </div>

                <!-- Footer Meta -->
                <div class="mt-16 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-8">
                    <div class="flex items-center gap-4">
                        <span class="text-xs font-black text-slate-500 uppercase tracking-widest">Tags:</span>
                        <div class="flex gap-2">
                            <?php the_tags('<span class="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 border border-white/5">', '</span> <span class="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 border border-white/5">', '</span>'); ?>
                        </div>
                    </div>

                    <!-- Share -->
                    <div class="flex items-center gap-4">
                        <span class="text-xs font-black text-slate-500 uppercase tracking-widest">Share Article:</span>
                        <div class="flex gap-3">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=<?php the_permalink(); ?>" target="_blank" class="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-orange-600 transition-all">
                                <i data-lucide="facebook" class="w-5 h-5"></i>
                            </a>
                            <a href="https://twitter.com/intent/tweet?url=<?php the_permalink(); ?>&text=<?php the_title(); ?>" target="_blank" class="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-orange-600 transition-all">
                                <i data-lucide="twitter" class="w-5 h-5"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </article>

            <!-- Post Navigation -->
            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6" data-aos="fade-up">
                <?php 
                $prev_post = get_previous_post();
                $next_post = get_next_post();
                ?>
                
                <div class="relative group">
                    <?php if ($prev_post) : ?>
                        <a href="<?php echo get_permalink($prev_post->ID); ?>" class="block p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-orange-500/30 transition-all h-full">
                            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Previous Article</p>
                            <h4 class="text-lg font-black text-white line-clamp-1 group-hover:text-orange-500 transition-colors"><?php echo get_the_title($prev_post->ID); ?></h4>
                        </a>
                    <?php endif; ?>
                </div>

                <div class="relative group text-right">
                    <?php if ($next_post) : ?>
                        <a href="<?php echo get_permalink($next_post->ID); ?>" class="block p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-orange-500/30 transition-all h-full">
                            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Next Article</p>
                            <h4 class="text-lg font-black text-white line-clamp-1 group-hover:text-orange-500 transition-colors"><?php echo get_the_title($next_post->ID); ?></h4>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>

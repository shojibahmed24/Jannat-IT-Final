import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/ui/AnimatedSection';
import GlowCard from '../components/ui/GlowCard';

const MOCK_POSTS = [
  {
    id: 1,
    slug: 'how-to-secure-your-linux-vps',
    title: 'How to Secure Your Linux VPS in 2026: A Complete Guide',
    excerpt: 'Learn the essential steps to harden your Linux server against modern cyber threats, from SSH keys to advanced firewall rules.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
    date: 'Oct 12, 2026',
    author: 'Alex Developer',
    category: 'Security',
    reading_time: '7 min read'
  },
  {
    id: 2,
    slug: 'understanding-nvme-vs-ssd',
    title: 'NVMe vs SSD: Why Your Next Server Must Have NVMe',
    excerpt: 'We dive deep into the performance differences between SATA SSDs and NVMe drives, and how it impacts your application speed.',
    thumbnail: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&q=80',
    date: 'Sep 28, 2026',
    author: 'Sarah Admin',
    category: 'Hardware',
    reading_time: '5 min read'
  },
  {
    id: 3,
    slug: 'docker-deployment-guide',
    title: 'Zero-Downtime Docker Deployments on a Single VPS',
    excerpt: 'Step-by-step tutorial on deploying your containerized apps using Docker Compose with zero downtime.',
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80',
    date: 'Sep 15, 2026',
    author: 'DevOps Team',
    category: 'Tutorials',
    reading_time: '10 min read'
  },
  {
    id: 4,
    slug: 'choosing-the-right-linux-distro',
    title: 'Ubuntu, Debian, or AlmaLinux? Choosing the Right Distro',
    excerpt: 'A comparison of the most popular Linux distributions for web servers and how to pick the perfect one for your stack.',
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80',
    date: 'Aug 30, 2026',
    author: 'Linux Guru',
    category: 'OS Guide',
    reading_time: '6 min read'
  }
];

export default function Blog() {
  const [posts, setPosts] = useState<any[]>(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const res = await fetch(`${wpData.apiUrl}jannat-it/v1/blog`);
          const data = await res.json();
          if (data && data.length > 0 && !data.error) {
            setPosts(data);
          }
        } catch (err) {
          console.error('Failed to fetch blog posts', err);
        }
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div className="min-h-screen pt-32 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <AnimatedSection className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-6">
            Knowledgebase & Blog
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Tutorials, guides, and updates from the Jannat IT engineering team.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
              placeholder="Search tutorials, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="text-center text-slate-500 py-20 animate-pulse">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center text-slate-500 py-20">No articles found matching "{searchQuery}".</div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <AnimatedSection className="mb-16">
                <Link to={`/blog/${featuredPost.slug}`}>
                  <div className="group relative bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-all duration-300 shadow-2xl hover:shadow-orange-500/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="h-64 lg:h-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-transparent to-transparent z-10 hidden lg:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent z-10 lg:hidden" />
                        <img 
                          src={featuredPost.thumbnail || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80'} 
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-5 sm:p-5 sm:p-8 lg:p-12">
                        <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6 border border-orange-500/20">
                          {featuredPost.category}
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 group-hover:text-orange-500 transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
                          <span className="flex items-center gap-2"><User className="w-4 h-4" /> {featuredPost.author}</span>
                          <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {featuredPost.date}</span>
                          <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {featuredPost.reading_time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            )}

            {/* Grid Posts */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post: any, idx: number) => (
                  <AnimatedSection key={post.id} delay={idx * 0.1}>
                    <Link to={`/blog/${post.slug}`}>
                      <GlowCard className="h-full group hover:shadow-orange-500/5 transition-all p-0 overflow-hidden flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={post.thumbnail || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80'} 
                            alt={post.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 bg-[#0A0A0B]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-orange-500 border border-orange-500/20">
                            {post.category}
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-4 border-t border-white/5">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.reading_time}</span>
                          </div>
                        </div>
                      </GlowCard>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

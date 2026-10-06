import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const wpData = (window as any).wpData;
      if (wpData && wpData.apiUrl) {
        try {
          const res = await fetch(`${wpData.apiUrl}jannat-it/v1/blog/${slug}`);
          const data = await res.json();
          if (data && !data.error) {
            setPost(data);
          } else {
            setError(true);
          }
        } catch (err) {
          console.error('Failed to fetch post', err);
          setError(true);
        }
      } else {
        // Fallback mock logic for local dev
        const MOCK_POST = {
          title: 'How to Secure Your Linux VPS in 2026: A Complete Guide',
          content: '<p>Security is paramount in the modern cloud landscape. <strong>Linux VPS security</strong> is not a set-it-and-forget-it task...</p><h2>1. SSH Key Authentication</h2><p>Never use password authentication for root. Always use RSA or Ed25519 keys.</p>',
          thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
          date: 'Oct 12, 2026',
          author: 'Alex Developer',
          category: 'Security',
          reading_time: '7 min read'
        };
        setPost(MOCK_POST);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  useSEO({
    title: post?.seo?.title || post?.title,
    description: post?.seo?.description || post?.excerpt,
    image: post?.seo?.og_image || post?.image
  });

  if (loading) {
    return <div className="min-h-screen pt-40 pb-20 text-center text-slate-500 animate-pulse">Loading article...</div>;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-40 pb-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Post not found</h1>
        <Link to="/blog" className="text-orange-500 hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 relative z-10 bg-[#0A0A0B]">
      <div className="max-w-3xl mx-auto px-6">
        
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors font-medium mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </Link>

        <AnimatedSection>
          <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6 border border-orange-500/20">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium pb-8 border-b border-white/10 mb-10">
            <span className="flex items-center gap-2 text-white"><User className="w-4 h-4 text-orange-500" /> {post.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.reading_time}</span>
            <button className="flex items-center gap-2 ml-auto hover:text-orange-500 transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </AnimatedSection>

        {post.thumbnail && (
          <AnimatedSection delay={0.1}>
            <div className="rounded-3xl overflow-hidden mb-12 border border-white/5 shadow-2xl">
              <img src={post.thumbnail} alt={post.title} className="w-full h-auto object-cover" />
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={0.2}>
          <article 
            className="text-slate-300 text-lg leading-relaxed space-y-6 
                       [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-6 
                       [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-10 [&>h3]:mb-4
                       [&>p]:mb-6 
                       [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
                       [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
                       [&>a]:text-orange-500 [&>a]:underline
                       [&>blockquote]:border-l-4 [&>blockquote]:border-orange-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-400
                       [&>pre]:bg-[#111] [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-white/10
                       [&>code]:bg-[#111] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-orange-400 [&>code]:text-sm"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </AnimatedSection>

      </div>
    </div>
  );
}

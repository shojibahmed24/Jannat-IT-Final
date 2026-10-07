import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { ArrowLeft, Calendar, Clock, User, Share2, List } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

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
        const MOCK_POST = {
          title: 'How to Secure Your Linux VPS in 2026: A Complete Guide',
          content: '<p>Security is paramount...</p><h2>SSH Key Authentication</h2><p>Never use password.</p><h2>Firewall Configuration</h2><p>Use UFW.</p>',
          thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
          date: 'Oct 12, 2026',
          author: 'Alex Developer',
          category: 'Security',
          reading_time: '7 min read',
          seo: { title: '', description: '' }
        };
        setPost(MOCK_POST);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  // Extract TOC and inject IDs into content
  const { toc, contentWithIds } = useMemo(() => {
    if (!post?.content) return { toc: [], contentWithIds: '' };
    
    const headings: { id: string; text: string; level: number }[] = [];
    
    // Regex to match <h2> and <h3>
    const newContent = post.content.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match: string, tag: string, attrs: string, text: string) => {
      // Strip html tags from text for the id
      const cleanText = text.replace(/<[^>]*>?/gm, '');
      const id = slugify(cleanText);
      headings.push({ id, text: cleanText, level: parseInt(tag.charAt(1)) });
      
      // Inject id attribute if it doesn't have one
      if (!attrs.includes('id=')) {
        return `<${tag} id="${id}"${attrs}>${text}</${tag}>`;
      }
      return match;
    });

    return { toc: headings, contentWithIds: newContent };
  }, [post?.content]);

  useSEO({
    title: post?.seo?.title || post?.title,
    description: post?.seo?.description || post?.excerpt,
    image: post?.seo?.og_image || post?.thumbnail
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
      <div className="max-w-4xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content */}
        <div className="flex-1 lg:max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors font-medium mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>

          <AnimatedSection>
            <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6 border border-orange-500/20">
              {post.category}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
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

          {/* Mobile TOC */}
          {toc.length > 0 && (
            <AnimatedSection delay={0.15}>
              <div className="lg:hidden mb-10 bg-[#111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <List className="w-5 h-5 text-orange-500" /> Table of Contents
                </h3>
                <ul className="space-y-3">
                  {toc.map((heading) => (
                    <li key={heading.id} className={`${heading.level === 3 ? 'pl-4' : ''}`}>
                      <a href={`#${heading.id}`} className="text-slate-400 hover:text-orange-500 transition-colors text-sm">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection delay={0.2}>
            <article 
              className="text-slate-300 text-base md:text-lg leading-relaxed space-y-6 
                         [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:scroll-mt-24
                         [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:scroll-mt-24
                         [&>p]:mb-6 
                         [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
                         [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
                         [&>a]:text-orange-500 [&>a]:underline
                         [&>blockquote]:border-l-4 [&>blockquote]:border-orange-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-400
                         [&>pre]:bg-[#111] [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-white/10
                         [&>code]:bg-[#111] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-orange-400 [&>code]:text-sm"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />
          </AnimatedSection>
        </div>

        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32">
            {toc.length > 0 && (
              <div className="bg-[#111]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold flex items-center gap-2 mb-6">
                  <List className="w-5 h-5 text-orange-500" /> Table of Contents
                </h3>
                <nav className="max-h-[60vh] overflow-y-auto scrollbar-hide pr-2">
                  <ul className="space-y-4">
                    {toc.map((heading) => (
                      <li key={heading.id} className={`${heading.level === 3 ? 'pl-4' : ''}`}>
                        <a href={`#${heading.id}`} className="text-sm text-slate-400 hover:text-orange-500 transition-colors block leading-tight">
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SEO from "@/components/SEO";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Share2, MessageCircle, Copy, Clock, User, ArrowLeft, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Blog {
    id: string;
    title: string;
    content: string;
    image: string;
    author: string;
    timestamp: number;
}

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const blogRef = ref(db, `blogs/${id}`);
        const unsubscribe = onValue(blogRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setBlog({ id, ...data });
            } else {
                setBlog(null);
            }
            setLoading(false);
        });

        // Fetch related blogs (just latest 3 excluding current)
        const allBlogsRef = ref(db, 'blogs');
        onValue(allBlogsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data)
                    .map((key) => ({ id: key, ...data[key] }))
                    .filter(b => b.id !== id)
                    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                    .slice(0, 3);
                setRelatedBlogs(list);
            }
        });

        return () => unsubscribe();
    }, [id]);

    const handleShare = async (platform: string) => {
        const url = window.location.href;
        const text = blog?.title || 'Check out this post!';
        let shareUrl = '';

        try {
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                    break;
                case 'native':
                    if (navigator.share) {
                        await navigator.share({
                            title: text,
                            text: text,
                            url: url,
                        });
                        return;
                    }
                    break;
                case 'copy':
                    await navigator.clipboard.writeText(url);
                    toast.success('Link copied to clipboard!');
                    return;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // Don't show toast for user cancelling a native share
            if ((error as any).name !== 'AbortError') {
                toast.error('Failed to share');
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!blog) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
            <Link to="/blog">
                <Button>Back to Blog</Button>
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title={blog.title}
                description={blog.content.substring(0, 150) + '...'}
                image={blog.image}
                url={window.location.href}
            />
            <Navbar />
            <main>
                <PageHeader title={blog.title} breadcrumb="Blog Details" />

                <section className="py-24 bg-background relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-l-full blur-3xl -z-10" />

                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-3 gap-16">
                            <article className="lg:col-span-2">
                                <Link to="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
                                    <ArrowLeft size={16} className="mr-2" /> Back to Blog
                                </Link>

                                <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-white/20 mb-12">
                                    {blog.image && (
                                        <div className="w-full h-[400px] relative">
                                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        </div>
                                    )}

                                    <div className="p-8 md:p-12">
                                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground mb-8 pb-8 border-b border-border">
                                            <span className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                                                <Calendar size={14} />
                                                {blog.timestamp ? format(blog.timestamp, 'MMMM d, yyyy') : 'N/A'}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <User size={14} />
                                                By {blog.author}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock size={14} />
                                                {Math.ceil(blog.content.split(' ').length / 200)} min read
                                            </span>
                                        </div>

                                        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                            {blog.content}
                                        </div>

                                        <div className="border-t border-border mt-12 pt-8">
                                            <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                                <Share2 size={20} className="text-primary" />
                                                Share this post
                                            </h3>
                                            <div className="flex flex-wrap gap-4">
                                                {[
                                                    { id: 'facebook', icon: Facebook, label: 'Facebook' },
                                                    { id: 'twitter', icon: Twitter, label: 'Twitter' },
                                                    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
                                                    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
                                                    { id: 'copy', icon: Copy, label: 'Copy Link' }
                                                ].map((platform) => (
                                                    <Button
                                                        key={platform.id}
                                                        variant="outline"
                                                        size="icon"
                                                        className="rounded-full w-12 h-12 hover:bg-primary hover:text-white hover:border-primary transition-all"
                                                        onClick={() => handleShare(platform.id)}
                                                        title={platform.label}
                                                    >
                                                        <platform.icon size={20} />
                                                    </Button>
                                                ))}
                                                {navigator.share && (
                                                    <Button variant="outline" size="icon" className="rounded-full w-12 h-12" onClick={() => handleShare('native')} title="More options">
                                                        <Share2 size={20} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <aside className="lg:col-span-1">
                                <div className="sticky top-28 space-y-8">
                                    <div className="glass-card p-8 rounded-2xl shadow-lg border border-white/20">
                                        <h3 className="text-xl font-bold font-display mb-6 border-l-4 border-primary pl-4">Latest Posts</h3>
                                        <div className="space-y-6">
                                            {relatedBlogs.map((related) => (
                                                <Link key={related.id} to={`/blog/${related.id}`} className="flex flex-col gap-2 group p-4 rounded-xl hover:bg-muted/50 transition-colors">
                                                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                        {related.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar size={12} />
                                                        {related.timestamp ? format(related.timestamp, 'MMM d, yyyy') : 'N/A'}
                                                    </div>
                                                </Link>
                                            ))}
                                            {relatedBlogs.length === 0 && (
                                                <p className="text-muted-foreground text-sm">No other posts available.</p>
                                            )}
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-border">
                                            <Link to="/blog">
                                                <Button variant="ghost" className="w-full text-primary hover:text-primary/80 font-semibold">
                                                    View All Posts
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Newsletter or CTA placeholder */}
                                    <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                                        <h3 className="text-xl font-bold font-display mb-4 relative z-10">Study Abroad with Interman</h3>
                                        <p className="text-white/90 mb-6 text-sm relative z-10">
                                            Get expert counseling and guidance for your international education journey.
                                        </p>
                                        <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90 font-bold shadow-lg relative z-10">
                                            Contact Us
                                        </Button>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default BlogDetails;

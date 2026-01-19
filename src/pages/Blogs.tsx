import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SEO from "@/components/SEO";
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface Blog {
    id: string;
    title: string;
    content: string;
    image: string;
    author: string;
    timestamp: number;
}

const Blogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const blogsRef = ref(db, 'blogs');
        const unsubscribe = onValue(blogsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                setBlogs(list);
            } else {
                setBlogs([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Blog | Interman"
                description="Stay updated with the latest educational news, career tips, and study abroad guides from Interman Educational Services."
            />
            <Navbar />
            <main>
                <PageHeader title="OUR BLOG" breadcrumb="Blog" />
                <section className="py-24 bg-background relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-muted to-transparent -z-10" />
                    <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />

                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="section-title">LATEST UPDATES</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                                Insights, news, and expert advice for your educational journey.
                            </p>
                        </motion.div>

                        {loading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-96 rounded-2xl bg-muted/20 animate-pulse" />
                                ))}
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-20 glass-card rounded-2xl">
                                <p className="text-muted-foreground text-lg">No blog posts found at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {blogs.map((blog, index) => (
                                    <motion.div
                                        key={blog.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="h-full flex flex-col overflow-hidden border-0 shadow-lg glass-card hover:shadow-2xl hover:bg-card/90 transition-all duration-300 group">
                                            <div className="h-60 overflow-hidden relative">
                                                {blog.image ? (
                                                    <img
                                                        src={blog.image}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                                        <span className="text-4xl">📰</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            <CardHeader className="space-y-4 pb-2">
                                                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                                    <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                        <Calendar size={12} />
                                                        {blog.timestamp ? format(blog.timestamp, 'MMM d, yyyy') : 'N/A'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User size={12} />
                                                        {blog.author}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-xl font-bold font-display leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {blog.title}
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="flex-grow pt-2">
                                                <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                                                    {blog.content}
                                                </p>
                                            </CardContent>

                                            <CardFooter className="pt-0 pb-6">
                                                <Link to={`/blog/${blog.id}`} className="w-full">
                                                    <Button className="w-full bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all group-hover:shadow-md font-semibold">
                                                        Read More <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </Link>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Blogs;

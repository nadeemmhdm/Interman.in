import React, { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SEO from "@/components/SEO";
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Video, Image as ImageIcon, PlayCircle, ZoomIn } from 'lucide-react';

interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    src: string;
    title: string;
    timestamp: number;
    category?: string;
}

const Gallery = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const galleryRef = ref(db, 'gallery');
        const unsubscribe = onValue(galleryRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                // Sort by timestamp desc
                list.sort((a, b) => b.timestamp - a.timestamp);
                setItems(list);
            } else {
                setItems([]);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&rel=0`;
        }
        return url;
    };

    // Calculate grid classes based on index to create a diverse layout
    const getGridClass = (index: number) => {
        if (index === 0) return "md:col-span-2 md:row-span-2"; // Featured Large
        if (index === 5 || index === 9) return "md:col-span-2 md:row-span-1"; // Wide
        return "md:col-span-1 md:row-span-1";
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Gallery | Interman"
                description="Explore the Interman gallery. See our events, successful placements, and life at our campuses in India and abroad."
            />
            <Navbar />
            <main>
                <PageHeader title="OUR GALLERY" breadcrumb="Gallery" />
                <section className="py-24 bg-background relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-muted/30 to-transparent -z-10" />

                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="section-title">Life at Interman</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                                Explore our vibrant community, events, and the global success of our students.
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                                {[1, 2, 3, 4].map(i => <div key={i} className="bg-muted/20 animate-pulse rounded-xl" />)}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-muted-foreground/20">
                                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <p className="text-muted-foreground">Gallery is empty.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[280px]">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`relative group overflow-hidden rounded-2xl shadow-md border border-white/10 ${getGridClass(index)}`}
                                    >
                                        <div className="w-full h-full transform transition-transform duration-700 group-hover:scale-105">
                                            {item.type === 'image' ? (
                                                <img
                                                    src={item.src}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full relative bg-black">
                                                    <iframe
                                                        src={getEmbedUrl(item.src)}
                                                        className="w-full h-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
                                                        title={item.title}
                                                        allowFullScreen
                                                    />
                                                    {/* Block clicks on iframe to allow hover/click on card */}
                                                    <div className="absolute inset-0 bg-transparent z-10" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full z-20 pointer-events-none">
                                            {item.type === 'video' && (
                                                <div className="mb-auto self-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                                    <a
                                                        href={item.src}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="pointer-events-auto bg-primary/90 hover:bg-primary p-4 rounded-full shadow-xl transition-colors text-white inline-block backdrop-blur-md"
                                                    >
                                                        <PlayCircle size={32} fill="currentColor" className="text-white" />
                                                    </a>
                                                </div>
                                            )}

                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                                    <span className="bg-primary px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <h3 className="text-white text-lg font-bold leading-tight drop-shadow-md font-display">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>
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

export default Gallery;

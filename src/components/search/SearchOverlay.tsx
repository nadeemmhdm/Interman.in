
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X, ArrowRight, BookOpen, Quote, Image as ImageIcon, MapPin, FileText, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, get } from "firebase/database";

interface SearchProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchResult {
    id: string;
    title: string;
    description?: string;
    type: 'page' | 'course' | 'service' | 'gallery' | 'blog';
    link: string;
    icon?: React.ReactNode;
}

const staticPages: SearchResult[] = [
    { id: '1', title: 'Home', description: 'Interman Study Abroad Consultants', type: 'page', link: '/' },
    { id: '2', title: 'About Us', description: 'Our history, mission, and team', type: 'page', link: '/about' },
    { id: '3', title: 'Contact Us', description: 'Get in touch with us', type: 'page', link: '/contact' },
    { id: '4', title: 'Reviews', description: 'Students testimonials and feedback', type: 'page', link: '/reviews' },
    { id: '5', title: 'Blog', description: 'Latest news and updates', type: 'page', link: '/blog' },
    { id: '6', title: 'Gallery', description: 'Photos and videos of events', type: 'page', link: '/gallery' },
    { id: '7', title: 'Services', description: 'Our educational services', type: 'page', link: '/services' },
    { id: '8', title: 'Courses', description: 'Browse all courses', type: 'page', link: '/courses' },
];

const servicesList: SearchResult[] = [
    { id: 's1', title: 'Career Counseling', type: 'service', link: '/services' },
    { id: 's2', title: 'University Admissions', type: 'service', link: '/services' },
    { id: 's3', title: 'Visa Assistance', type: 'service', link: '/services' },
    { id: 's4', title: 'Accomodation Support', type: 'service', link: '/services' },
];

const SearchOverlay: React.FC<SearchProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [dbData, setDbData] = useState<{ courses: SearchResult[], gallery: SearchResult[], blogs: SearchResult[] }>({ courses: [], gallery: [], blogs: [] });

    useEffect(() => {
        if (isOpen) {
            // Fetch dynamic data when search opens
            const fetchData = async () => {
                try {
                    // Fetch Courses
                    const coursesSnapshot = await get(ref(db, 'courses'));
                    const courses: SearchResult[] = [];
                    if (coursesSnapshot.exists()) {
                        coursesSnapshot.forEach(child => {
                            const val = child.val();
                            courses.push({
                                id: child.key!,
                                title: val.name || val.title,
                                description: val.university,
                                type: 'course',
                                link: '/courses'
                            });
                        });
                    }

                    // Fetch Gallery Titles
                    const gallerySnapshot = await get(ref(db, 'gallery'));
                    const gallery: SearchResult[] = [];
                    if (gallerySnapshot.exists()) {
                        gallerySnapshot.forEach(child => {
                            const val = child.val();
                            gallery.push({
                                id: child.key!,
                                title: val.title,
                                type: 'gallery',
                                link: '/gallery'
                            });
                        });
                    }

                    // Fetch Blogs
                    const blogSnapshot = await get(ref(db, 'blogs'));
                    const blogs: SearchResult[] = [];
                    if (blogSnapshot.exists()) {
                        blogSnapshot.forEach(child => {
                            const val = child.val();
                            blogs.push({
                                id: child.key!,
                                title: val.title,
                                description: val.excerpt || (val.content ? val.content.substring(0, 50) + "..." : ""),
                                type: 'blog',
                                link: `/blog/${child.key}`
                            });
                        });
                    }

                    setDbData({ courses, gallery, blogs });
                } catch (e) {
                    console.error("Search fetch error", e);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        const timeoutId = setTimeout(() => {
            const q = query.toLowerCase();

            const combined = [
                ...staticPages,
                ...servicesList,
                ...dbData.courses,
                ...dbData.gallery,
                ...dbData.blogs
            ];

            const filtered = combined.filter(item =>
                item.title?.toLowerCase().includes(q) ||
                item.description?.toLowerCase().includes(q)
            ).slice(0, 10);

            setResults(filtered);
            setLoading(false);
        }, 200);

        return () => clearTimeout(timeoutId);
    }, [query, dbData]);

    const handleSelect = (link: string) => {
        onClose();
        navigate(link);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'course': return <BookOpen size={18} className="text-blue-500" />;
            case 'gallery': return <ImageIcon size={18} className="text-purple-500" />;
            case 'service': return <ArrowRight size={18} className="text-green-500" />;
            case 'blog': return <FileText size={18} className="text-orange-500" />;
            default: return <MapPin size={18} className="text-gray-500" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) { // Capitalize and improve labels
            case 'course': return 'Course';
            case 'gallery': return 'Gallery';
            case 'service': return 'Service';
            case 'blog': return 'Article';
            default: return 'Page';
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="sm:max-w-[700px] p-0 border-none shadow-none bg-transparent overflow-hidden [&>button]:hidden">
                        {/* Backdrop Blur applied by Dialog Overlay but also enhancing transparency here */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="w-full bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5"
                        >
                            {/* Input Header */}
                            <div className="flex items-center p-5 border-b border-gray-100/50 gap-4">
                                <SearchIcon className="text-primary w-6 h-6 stroke-[2.5]" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="What are you looking for?"
                                    className="border-none shadow-none focus-visible:ring-0 text-xl font-medium px-0 h-12 bg-transparent placeholder:text-gray-400"
                                    autoFocus
                                />
                                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-gray-100/50 px-2 py-1 rounded-md">
                                    <span className="font-semibold">ESC</span> to close
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 rounded-full hover:bg-gray-100/50 transition-colors text-gray-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Results */}
                            <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
                                {loading ? (
                                    <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                        <p>Searching Interman...</p>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="py-2">
                                        <div className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                                            <span>Best Matches</span>
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">{results.length} found</span>
                                        </div>
                                        <div className="mt-1">
                                            {results.map((result, index) => (
                                                <motion.button
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    key={result.id + result.type}
                                                    onClick={() => handleSelect(result.link)}
                                                    className="w-full px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50/80 transition-all text-left group border-l-4 border-transparent hover:border-primary relative"
                                                >
                                                    <div className={`p-3 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-300 ring-1 ring-black/5`}>
                                                        {getTypeIcon(result.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <h5 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-base truncate">
                                                                {result.title}
                                                            </h5>
                                                            <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded tracking-wide group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                                {getTypeLabel(result.type)}
                                                            </span>
                                                        </div>
                                                        {result.description && (
                                                            <p className="text-sm text-gray-500 truncate group-hover:text-gray-600 transition-colors">
                                                                {result.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <ArrowRight size={16} className="text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 transform" />
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                ) : query ? (
                                    <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <SearchIcon size={24} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No results found</h3>
                                        <p className="text-sm text-gray-500">We couldn't find anything matching "{query}"</p>
                                    </div>
                                ) : (
                                    <div className="p-8">
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { icon: BookOpen, label: "Browse Courses", link: "/courses", color: "text-blue-500", bg: "bg-blue-50" },
                                                { icon: FileText, label: "Read Our Blog", link: "/blog", color: "text-orange-500", bg: "bg-orange-50" },
                                                { icon: ArrowRight, label: "Our Services", link: "/services", color: "text-green-500", bg: "bg-green-50" },
                                                { icon: Quote, label: "Success Stories", link: "/reviews", color: "text-purple-500", bg: "bg-purple-50" }
                                            ].map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSelect(item.link)}
                                                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-gray-50/50 hover:shadow-sm transition-all group text-left"
                                                >
                                                    <div className={`p-2.5 rounded-lg ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                                        <item.icon size={20} />
                                                    </div>
                                                    <span className="font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;

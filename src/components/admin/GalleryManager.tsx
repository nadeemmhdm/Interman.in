
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, push, set, remove, onValue } from 'firebase/database';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Trash2, Edit2, Plus, X, Video, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    src: string; // Image URL or Video URL (Link)
    title: string;
    timestamp: number;
}

const GalleryManager = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({
        type: 'image',
        src: '',
        title: '',
    });

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
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const itemData = {
                type: currentItem.type,
                src: currentItem.src,
                title: currentItem.title,
                timestamp: currentItem.timestamp || Date.now()
            };

            if (currentItem.id) {
                // Update
                await set(ref(db, `gallery/${currentItem.id}`), itemData);
                toast.success('Gallery item updated');
            } else {
                // Create
                const newRef = push(ref(db, 'gallery'));
                await set(newRef, itemData);
                toast.success('Gallery item added');
            }

            resetForm();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save item');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this item?')) {
            try {
                await remove(ref(db, `gallery/${id}`));
                toast.success('Item deleted');
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete item');
            }
        }
    };

    const handleEdit = (item: GalleryItem) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentItem({ type: 'image', src: '', title: '' });
        setIsEditing(false);
    };

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        // Basic Youtube/Vimeo/Public link handling
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url; // Assume direct link or other embeddable
    };

    return (
        <div className="space-y-8">
            {/* Form */}
            <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{isEditing ? 'Edit Item' : 'Add New Gallery Item'}</h3>
                    {isEditing && (
                        <Button variant="ghost" size="sm" onClick={resetForm}>
                            <X size={16} className="mr-2" /> Cancel Edit
                        </Button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <Select
                                value={currentItem.type}
                                onValueChange={(v: 'image' | 'video') => setCurrentItem({ ...currentItem, type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title/Caption</label>
                            <Input
                                placeholder="e.g. Graduation Day"
                                value={currentItem.title}
                                onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">URL {currentItem.type === 'video' ? '(YouTube/Vimeo/Direct Link)' : '(Image Host URL)'}</label>
                        <Input
                            placeholder={currentItem.type === 'video' ? "https://youtube.com/..." : "https://example.com/image.jpg"}
                            value={currentItem.src}
                            onChange={(e) => setCurrentItem({ ...currentItem, src: e.target.value })}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full md:w-auto">
                        <Plus size={16} className="mr-2" />
                        {isEditing ? 'Update Item' : 'Add Item'}
                    </Button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                        <div className="aspect-video bg-black/5 relative">
                            {item.type === 'image' ? (
                                <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <iframe
                                    src={getEmbedUrl(item.src)}
                                    className="w-full h-full"
                                    title={item.title}
                                    allowFullScreen
                                />
                            )}

                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button size="icon" variant="secondary" onClick={() => handleEdit(item)}>
                                    <Edit2 size={16} />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>

                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded uppercase font-bold flex items-center gap-1">
                                {item.type === 'video' ? <Video size={10} /> : <ImageIcon size={10} />}
                                {item.type}
                            </div>
                        </div>
                        <div className="p-3">
                            <h4 className="font-medium truncate" title={item.title}>{item.title}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryManager;

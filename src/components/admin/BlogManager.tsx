
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, remove, push, set, update } from 'firebase/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Blog {
    id: string;
    title: string;
    content: string;
    image: string;
    author: string;
    timestamp: number;
}

const BlogManager = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState({ title: '', content: '', image: '', author: '' });

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
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBlog) {
                await update(ref(db, `blogs/${editingBlog.id}`), {
                    ...formData,
                    timestamp: Date.now() // Update timestamp on edit? Maybe not.
                });
                toast.success('Blog updated successfully');
            } else {
                const newBlogRef = push(ref(db, 'blogs'));
                await set(newBlogRef, {
                    ...formData,
                    timestamp: Date.now()
                });
                toast.success('Blog created successfully');
            }
            setIsOpen(false);
            setEditingBlog(null);
            setFormData({ title: '', content: '', image: '', author: '' });
        } catch (error) {
            console.error(error);
            toast.error('Failed to save blog');
        }
    };

    const handleEdit = (blog: Blog) => {
        setEditingBlog(blog);
        setFormData({ title: blog.title, content: blog.content, image: blog.image || '', author: blog.author || '' });
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this blog post?')) {
            try {
                await remove(ref(db, `blogs/${id}`));
                toast.success('Blog deleted');
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete blog');
            }
        }
    };

    const openNew = () => {
        setEditingBlog(null);
        setFormData({ title: '', content: '', image: '', author: '' });
        setIsOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Blog Posts</h3>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add New Blog</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} required />
                            </div>
                            <Button type="submit" className="w-full">{editingBlog ? 'Update' : 'Create'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {blogs.map((blog) => (
                        <TableRow key={blog.id}>
                            <TableCell>{blog.timestamp ? format(blog.timestamp, 'PP') : 'N/A'}</TableCell>
                            <TableCell>{blog.title}</TableCell>
                            <TableCell>{blog.author}</TableCell>
                            <TableCell className="flex space-x-2">
                                <Button variant="outline" size="icon" onClick={() => handleEdit(blog)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(blog.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default BlogManager;

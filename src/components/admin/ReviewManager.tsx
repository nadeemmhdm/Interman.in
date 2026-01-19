
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, push, set, remove, onValue, update } from 'firebase/database';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { Trash2, Edit2, Plus, X, Monitor, Calendar, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from "@/components/ui/switch";

interface Review {
    id: string;
    name: string;
    content: string;
    rating: number; // 1-5
    timestamp: number;
    ip?: string;
    userAgent?: string;
    role?: string; // Optional role like "Student"
    image?: string; // User profile image URL
}

const ReviewManager = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentReview, setCurrentReview] = useState<Partial<Review>>({
        name: '',
        content: '',
        rating: 5,
        role: '',
        image: ''
    });
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [publicSubmissionEnabled, setPublicSubmissionEnabled] = useState(true);

    useEffect(() => {
        // Listen to reviews
        const reviewsRef = ref(db, 'reviews');
        const unsubscribeReviews = onValue(reviewsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                list.sort((a, b) => b.timestamp - a.timestamp);
                setReviews(list);
            } else {
                setReviews([]);
            }
        });

        // Listen to settings
        const settingsRef = ref(db, 'settings/reviews');
        const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.publicSubmission !== undefined) {
                setPublicSubmissionEnabled(data.publicSubmission);
            }
        });

        return () => {
            unsubscribeReviews();
            unsubscribeSettings();
        };
    }, []);

    const togglePublicSubmission = async () => {
        try {
            const newValue = !publicSubmissionEnabled;
            await update(ref(db, 'settings/reviews'), {
                publicSubmission: newValue
            });
            setPublicSubmissionEnabled(newValue);
            toast.success(`Public reviews turned ${newValue ? 'ON' : 'OFF'}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update settings");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const timestamp = selectedDate ? new Date(selectedDate).getTime() : Date.now();

            const reviewData = {
                name: currentReview.name,
                content: currentReview.content,
                rating: Number(currentReview.rating),
                role: currentReview.role || 'Student',
                image: currentReview.image || '',
                timestamp: timestamp
            };

            if (currentReview.id) {
                // Update
                await update(ref(db, `reviews/${currentReview.id}`), {
                    ...reviewData,
                    ip: currentReview.ip,
                    userAgent: currentReview.userAgent
                });
                toast.success('Review updated');
            } else {
                // Create
                const newRef = push(ref(db, 'reviews'));
                await set(newRef, {
                    ...reviewData,
                    ip: 'Admin Added',
                    userAgent: 'Admin Dashboard'
                });
                toast.success('Review added');
            }

            resetForm();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save review');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this review?')) {
            try {
                await remove(ref(db, `reviews/${id}`));
                toast.success('Review deleted');
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete review');
            }
        }
    };

    const handleEdit = (review: Review) => {
        setCurrentReview(review);
        const date = new Date(review.timestamp);
        const dateString = date.toISOString().split('T')[0];
        setSelectedDate(dateString);
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentReview({ name: '', content: '', rating: 5, role: '', image: '' });
        setSelectedDate('');
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            {/* Settings */}
            <div className="bg-white p-6 rounded-lg border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                        <Settings size={24} className="text-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Public Review Submission</h3>
                        <p className="text-sm text-gray-500">Allow users to submit reviews on the public website</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${publicSubmissionEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                        {publicSubmissionEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                        checked={publicSubmissionEnabled}
                        onCheckedChange={togglePublicSubmission}
                    />
                </div>
            </div>

            {/* Form */}
            <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{isEditing ? 'Edit Review' : 'Add New Review'}</h3>
                    {isEditing && (
                        <Button variant="ghost" size="sm" onClick={resetForm}>
                            <X size={16} className="mr-2" /> Cancel Edit
                        </Button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Name"
                            value={currentReview.name}
                            onChange={(e) => setCurrentReview({ ...currentReview, name: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Role (e.g. Student)"
                            value={currentReview.role}
                            onChange={(e) => setCurrentReview({ ...currentReview, role: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium mb-1 block">Rating (1-5)</label>
                            <Input
                                type="number"
                                min="1"
                                max="5"
                                value={currentReview.rating}
                                onChange={(e) => setCurrentReview({ ...currentReview, rating: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium mb-1 block">Date Added</label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            <p className="text-[10px] text-muted-foreground">Leave empty for current time</p>
                        </div>
                    </div>

                    <Input
                        placeholder="User Image URL (Optional)"
                        value={currentReview.image}
                        onChange={(e) => setCurrentReview({ ...currentReview, image: e.target.value })}
                    />

                    <Textarea
                        placeholder="Review Content"
                        value={currentReview.content}
                        onChange={(e) => setCurrentReview({ ...currentReview, content: e.target.value })}
                        required
                        className="min-h-[100px]"
                    />

                    <Button type="submit" className="w-full md:w-auto">
                        <Plus size={16} className="mr-2" />
                        {isEditing ? 'Update Review' : 'Add Review'}
                    </Button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b font-medium grid grid-cols-12 gap-4 bg-gray-50/50">
                    <div className="col-span-3">User</div>
                    <div className="col-span-5">Content</div>
                    <div className="col-span-2">Info</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y max-h-[600px] overflow-y-auto">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-4 grid grid-cols-12 gap-4 hover:bg-gray-50 transition-colors">
                            <div className="col-span-3">
                                <p className="font-semibold">{review.name}</p>
                                <p className="text-xs text-muted-foreground">{review.role}</p>
                                <div className="flex text-yellow-500 text-xs mt-1">
                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </div>
                            </div>
                            <div className="col-span-5">
                                <p className="text-sm text-gray-700 line-clamp-2" title={review.content}>{review.content}</p>
                                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {format(review.timestamp, 'MMM dd, yyyy')}
                                </p>
                            </div>
                            <div className="col-span-2 text-xs text-gray-400 space-y-1">
                                {review.ip && (
                                    <div className="flex items-center gap-1" title="IP Address">
                                        <Monitor size={10} />
                                        {review.ip}
                                    </div>
                                )}
                                {review.userAgent && (
                                    <div className="truncate w-full" title={review.userAgent}>
                                        {review.userAgent}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-2 flex justify-end gap-2 items-start">
                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-blue-600" onClick={() => handleEdit(review)}>
                                    <Edit2 size={14} />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-red-600" onClick={() => handleDelete(review.id)}>
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {reviews.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No reviews found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewManager;

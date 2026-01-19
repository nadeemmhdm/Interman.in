
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, remove } from 'firebase/database';
import { Trash2, Mail, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface Subscriber {
    id: string;
    email: string;
    timestamp: number;
}

const SubscribersManager = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subRef = ref(db, 'subscribers');
        const unsubscribe = onValue(subRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => b.timestamp - a.timestamp);
                setSubscribers(list);
            } else {
                setSubscribers([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this subscriber?')) {
            try {
                await remove(ref(db, `subscribers/${id}`));
                toast.success('Subscriber removed');
            } catch (error) {
                console.error(error);
                toast.error('Failed to remove subscriber');
            }
        }
    };

    const handleCopy = (email: string) => {
        navigator.clipboard.writeText(email);
        toast.success("Email copied to clipboard");
    };

    if (loading) return <div className="p-4">Loading subscribers...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Subscribers</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{subscribers.length}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Mail size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between col-span-1 md:col-span-2">
                    <div>
                        <h3 className="font-semibold text-gray-900">Newsletter List</h3>
                        <p className="text-sm text-gray-500">Manage your newsletter subscribers here.</p>
                    </div>
                    <Button variant="outline" onClick={() => {
                        const allEmails = subscribers.map(s => s.email).join(', ');
                        navigator.clipboard.writeText(allEmails);
                        toast.success("All emails copied!");
                    }}>
                        Copy All Emails
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="divide-y">
                    {subscribers.map((sub) => (
                        <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                    {sub.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleCopy(sub.email)}
                                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2"
                                        title="Click to copy"
                                    >
                                        {sub.email}
                                    </button>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                        <Calendar size={12} />
                                        {new Date(sub.timestamp).toLocaleDateString()} at {new Date(sub.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-red-500" onClick={() => handleDelete(sub.id)}>
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    ))}
                    {subscribers.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <Mail size={48} className="mx-auto mb-4 text-gray-200" />
                            <p>No subscribers yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscribersManager;

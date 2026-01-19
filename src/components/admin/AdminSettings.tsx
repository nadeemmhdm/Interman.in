
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, update } from 'firebase/database';
import { Switch } from "@/components/ui/switch";
import { Settings, MessageSquare, AlertTriangle, User } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const AdminSettings = () => {
    const [chatbotEnabled, setChatbotEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [chairmanImage, setChairmanImage] = useState('');

    useEffect(() => {
        const settingsRef = ref(db, 'settings/chatbot');
        const unsubscribe = onValue(settingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data !== null && data.enabled !== undefined) {
                setChatbotEnabled(data.enabled);
            }
        });

        const aboutRef = ref(db, 'settings/about');
        const unsubscribeAbout = onValue(aboutRef, (snapshot) => {
            const data = snapshot.val();
            if (data?.chairmanImage) {
                setChairmanImage(data.chairmanImage);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
            unsubscribeAbout();
        }
    }, []);

    const toggleChatbot = async () => {
        const newValue = !chatbotEnabled;
        try {
            await update(ref(db, 'settings/chatbot'), {
                enabled: newValue,
                updatedAt: Date.now()
            });
            setChatbotEnabled(newValue);
            toast.success(`Chatbot ${newValue ? 'Enabled' : 'Disabled'}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update settings");
        }
    };

    const handleSaveAbout = async () => {
        try {
            await update(ref(db, 'settings/about'), {
                chairmanImage: chairmanImage,
                updatedAt: Date.now()
            });
            toast.success("About page settings saved");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save settings");
        }
    };

    if (loading) return <div className="p-4">Loading settings...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    General Settings
                </h3>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${chatbotEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">AI Chatbot</h4>
                            <p className="text-sm text-gray-500">
                                Turn the AI assistant on or off globally. When disabled, the chat icon will disappear for all visitors.
                            </p>
                            {!chatbotEnabled && (
                                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                    <AlertTriangle size={12} /> Currently hidden from public view
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${chatbotEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                            {chatbotEnabled ? 'Active' : 'Disabled'}
                        </span>
                        <Switch
                            checked={chatbotEnabled}
                            onCheckedChange={toggleChatbot}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    About Page Settings
                </h3>

                <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Chairman Image URL</label>
                        <Input
                            value={chairmanImage}
                            onChange={(e) => setChairmanImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-gray-500">Enter a direct URL to an image to replace the default Chairman photo.</p>
                    </div>
                    {chairmanImage && (
                        <div className="mt-2">
                            <p className="text-xs font-medium text-gray-500 mb-1">Preview:</p>
                            <img src={chairmanImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                        </div>
                    )}
                    <Button onClick={handleSaveAbout}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;

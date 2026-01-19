
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Phone, Minimize2, CheckCheck, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { ref, push, set, onValue, update, off } from 'firebase/database';
import { keywords, defaultReplies } from './chat-data';
import logo from '@/assets/logo.png';
import chatbotImg from '@/assets/chatbot.png';
import { toast } from 'sonner';

interface Message {
    id?: string;
    text: string;
    sender: 'user' | 'bot' | 'admin';
    timestamp: number;
    read?: boolean;
}

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'bot' | 'connect' | 'live'>('bot');
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hi! I'm the Interman Assistant. How can I help you today?", sender: 'bot', timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [userDetails, setUserDetails] = useState({ name: '', phone: '' });
    const [chatId, setChatId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial load from local storage if live chat exists
    const [isGlobalEnabled, setIsGlobalEnabled] = useState(true);

    useEffect(() => {
        // Check global settings
        const settingsRef = ref(db, 'settings/chatbot');
        const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data !== null && data.enabled !== undefined) {
                setIsGlobalEnabled(data.enabled);
            }
        });

        const storedChat = localStorage.getItem('interman_chat_session');
        if (storedChat) {
            const { id, timestamp } = JSON.parse(storedChat);
            // Check if session is valid (24 hours)
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                setChatId(id);
                setMode('live');
            } else {
                localStorage.removeItem('interman_chat_session');
            }
        }
        return () => unsubscribeSettings();
    }, []);

    // Scroll to bottom
    useEffect(() => {
        if (isGlobalEnabled) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, mode, isGlobalEnabled]);

    // Live chat sync
    useEffect(() => {
        if (!isGlobalEnabled) return;

        if (mode === 'live' && chatId) {
            const chatRef = ref(db, `chats/${chatId}/messages`);
            // ... (rest of logic)

            // Listen for new messages
            const unsubscribe = onValue(chatRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const loadedMessages = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    setMessages(loadedMessages);
                }
            });

            // Update user status to online/active
            update(ref(db, `chats/${chatId}`), {
                lastActive: Date.now(),
                status: 'active'
            });

            return () => {
                off(chatRef);
                unsubscribe();
            };
        }
    }, [mode, chatId]);


    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { text: input, sender: 'user', timestamp: Date.now() };

        if (mode === 'bot') {
            setMessages(prev => [...prev, userMsg]);
            setInput('');
            processBotResponse(input.toLowerCase());
        } else if (mode === 'live' && chatId) {
            setInput('');
            const chatRef = ref(db, `chats/${chatId}/messages`);
            await push(chatRef, userMsg);

            // Update last active
            update(ref(db, `chats/${chatId}`), {
                lastActive: Date.now()
            });
        }
    };

    const processBotResponse = (text: string) => {
        // 1. Check for blocked words
        // We import blockedWords from chat-data, but if it's not exported properly or we want to be safe:
        const blocked = ['badword', 'idiot', 'stupid', 'dumb', 'hate', 'kill', 'shut up', 'fuck', 'shit', 'bitch', 'asshole'];
        if (blocked.some(word => text.includes(word))) {
            setTimeout(() => {
                setMessages(prev => [...prev, { text: "Please let's keep the conversation professional.", sender: 'bot', timestamp: Date.now() }]);
            }, 600);
            return;
        }

        // 2. Keyword Matching
        let responseText = '';
        let triggerConnect = false;

        // Find matches: prioritize longer matches! (e.g. "medical course" > "course")
        // But our object keys are simple.
        // We can check multiple keywords.
        const foundKey = Object.keys(keywords).find(key => text.includes(key));

        if (foundKey) {
            const reply = keywords[foundKey];
            if (reply === 'connect_trigger') {
                responseText = "It looks like you want to speak to a human. Let's get you connected.";
                triggerConnect = true;
            } else {
                responseText = reply;
            }
        } else {
            // No direct match? Check platform data or vague match
            responseText = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { text: responseText, sender: 'bot', timestamp: Date.now() }]);
            if (triggerConnect) {
                setTimeout(() => setMode('connect'), 1000);
            }
        }, 600);
    };

    const handleConnectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!userDetails.name.trim()) {
            toast.error("Please enter your name");
            return;
        }

        const phoneRegex = /^\d{10}$/;
        const sanitizedPhone = userDetails.phone.replace(/\D/g, '');

        if (!phoneRegex.test(sanitizedPhone)) {
            toast.error("Please enter a valid 10-digit mobile number");
            return;
        }

        const newChatId = sanitizedPhone;

        try {
            await set(ref(db, `chats/${newChatId}`), {
                user: userDetails,
                status: 'active',
                lastActive: Date.now(),
                messages: [
                    ...messages.map(m => ({ ...m })), // Copy existing conversation history
                    { text: `User ${userDetails.name} joined via connect form.`, sender: 'bot', timestamp: Date.now() }
                ]
            });

            localStorage.setItem('interman_chat_session', JSON.stringify({
                id: newChatId,
                timestamp: Date.now()
            }));

            setChatId(newChatId);
            setMode('live');
            toast.success("Connected to live support!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to connect. Try again.");
        }
    };

    const handleEndChat = async () => {
        if (window.confirm("Are you sure you want to end this chat session?")) {
            if (chatId) {
                try {
                    await update(ref(db, `chats/${chatId}`), { status: 'ended' });
                } catch (e) { console.error(e); }
            }
            localStorage.removeItem('interman_chat_session');
            setChatId(null);
            setMode('bot');
            setMessages([{ text: "Session ended. How can I help you now?", sender: 'bot', timestamp: Date.now() }]);
        }
    };

    if (!isGlobalEnabled) return null;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />

                        {/* Chat Window */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[380px] h-[500px] shadow-2xl rounded-2xl overflow-hidden flex flex-col bg-white border border-gray-200"
                        >
                            {/* Header */}
                            <div className="bg-primary p-4 flex justify-between items-center text-primary-foreground">
                                <div className="flex items-center gap-2">
                                    <img src={logo} alt="Logo" className="w-8 h-8 rounded-full bg-white p-1" />
                                    <div>
                                        <h3 className="font-bold text-sm">Interman Support</h3>
                                        <span className="text-xs opacity-90 flex items-center gap-1">
                                            <span className={`w-2 h-2 rounded-full ${mode === 'live' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                            {mode === 'live' ? 'Live Agent' : 'Automated Assistant'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {mode === 'live' && (
                                        <button onClick={handleEndChat} className="hover:bg-primary/80 p-1 rounded" title="End Chat">
                                            <Power size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => setIsOpen(false)} className="hover:bg-primary/80 p-1 rounded">
                                        <Minimize2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                                {mode === 'connect' ? (
                                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                                        <div className="bg-white p-6 rounded-lg shadow-sm w-full">
                                            <h4 className="font-semibold text-center mb-4">Connect with an Agent</h4>
                                            <form onSubmit={handleConnectSubmit} className="space-y-3">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium">Name</label>
                                                    <div className="relative">
                                                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Your Name"
                                                            className="pl-9"
                                                            value={userDetails.name}
                                                            onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium">WhatsApp / Phone</label>
                                                    <div className="relative">
                                                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Your Number"
                                                            className="pl-9"
                                                            value={userDetails.phone}
                                                            onChange={e => setUserDetails({ ...userDetails, phone: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <Button type="submit" className="w-full">Start Chat</Button>
                                                <button
                                                    type="button"
                                                    onClick={() => setMode('bot')}
                                                    className="text-xs text-muted-foreground hover:underline w-full text-center"
                                                >
                                                    Return to Bot
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                                        ? 'bg-primary text-primary-foreground rounded-br-none'
                                                        : msg.sender === 'admin'
                                                            ? 'bg-blue-600 text-white rounded-bl-none'
                                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                                                        }`}
                                                >
                                                    <p>{msg.text}</p>
                                                    <div className={`text-[10px] mt-1 flex justify-end items-center gap-1 ${msg.sender === 'user' ? 'text-primary-foreground/80' : 'text-gray-400'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {msg.read && msg.sender === 'user' && <CheckCheck size={12} />}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Input Area */}
                            {mode !== 'connect' && (
                                <div className="p-3 bg-white border-t flex gap-2">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder={mode === 'live' ? "Type a message..." : "Ask me anything..."}
                                        className="flex-1"
                                    />
                                    <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
                                        <Send size={18} />
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 bg-transparent p-0"
            >
                {isOpen ? (
                    <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white">
                        <X size={24} />
                    </div>
                ) : (
                    <div className="relative w-full h-full">
                        <img src={chatbotImg} alt="Chat" className="w-full h-full object-contain drop-shadow-lg" />
                        <span className="absolute top-1 right-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse z-10" />
                    </div>
                )}
            </motion.button>
        </>
    );
};

export default ChatBot;

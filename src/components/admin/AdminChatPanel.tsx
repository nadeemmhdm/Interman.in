
import React, { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, update, remove, push } from 'firebase/database';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Smile, Phone, Clock, MoreVertical, Trash2, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmojiPicker from 'emoji-picker-react';

interface ChatSession {
    id: string;
    user: { name: string; phone: string };
    lastActive: number;
    status: 'active' | 'ended';
    messages?: Record<string, {
        text: string;
        sender: 'user' | 'bot' | 'admin';
        timestamp: number;
        read?: boolean;
    }>;
}

const AdminChatPanel = () => {
    const [chats, setChats] = useState<ChatSession[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatsRef = ref(db, 'chats');
        const unsubscribe = onValue(chatsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const chatList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => b.lastActive - a.lastActive);
                setChats(chatList);
            } else {
                setChats([]);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chats, selectedChatId]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !selectedChatId) return;

        const chatRef = ref(db, `chats/${selectedChatId}/messages`);
        await push(chatRef, {
            text: inputValue,
            sender: 'admin',
            timestamp: Date.now(),
            read: false
        });

        await update(ref(db, `chats/${selectedChatId}`), {
            lastActive: Date.now()
        });

        setInputValue('');
    };

    const handleEndSession = async (chatId: string) => {
        if (window.confirm("End this chat session?")) {
            await update(ref(db, `chats/${chatId}`), { status: 'ended' });
            setSelectedChatId(null);
        }
    };

    const handleDeleteSession = async (chatId: string) => {
        if (window.confirm("Delete this chat permanently?")) {
            await remove(ref(db, `chats/${chatId}`));
            if (selectedChatId === chatId) setSelectedChatId(null);
        }
    };

    const selectedChat = chats.find(c => c.id === selectedChatId);
    const messages = selectedChat?.messages
        ? Object.values(selectedChat.messages).sort((a, b) => a.timestamp - b.timestamp)
        : [];

    return (
        <div className="flex h-[600px] border rounded-lg bg-background overflow-hidden shadow-sm">
            {/* Sidebar list */}
            <div className="w-1/3 border-r bg-gray-50 flex flex-col">
                <div className="p-4 border-b bg-white">
                    <h3 className="font-semibold text-sm">Active Conversations ({chats.length})</h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {chats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                className={`p-4 text-left border-b hover:bg-gray-100 transition-colors flex justify-between items-start ${selectedChatId === chat.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                            >
                                <div>
                                    <div className="font-medium text-sm">{chat.user.name}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Phone size={10} /> {chat.user.phone}
                                    </div>
                                    <div className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-block ${chat.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {chat.status}
                                    </div>
                                </div>
                                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatDistanceToNow(chat.lastActive, { addSuffix: true })}
                                </div>
                            </button>
                        ))}
                        {chats.length === 0 && (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                No active chats found.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Body */}
            <div className="flex-1 flex flex-col bg-slate-50">
                {selectedChatId && selectedChat ? (
                    <>
                        <div className="p-3 border-b bg-white flex justify-between items-center shadow-sm z-10">
                            <div>
                                <h4 className="font-semibold">{selectedChat.user.name}</h4>
                                <span className="text-xs text-muted-foreground">{selectedChat.user.phone}</span>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"><MoreVertical size={18} /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEndSession(selectedChat.id)}>
                                        End Session
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteSession(selectedChat.id)} className="text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Chat
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-lg text-sm shadow-sm ${msg.sender === 'admin'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : msg.sender === 'bot'
                                                ? 'bg-gray-200 text-gray-600 text-xs italic' // Bot messages
                                                : 'bg-white text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                        <div className={`text-[10px] mt-1 flex justify-end gap-1 ${msg.sender === 'admin' ? 'text-primary-foreground/80' : 'text-gray-400'}`}>
                                            {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                                            {msg.sender === 'admin' && <CheckCheck size={12} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-white border-t flex gap-2 relative">
                            <div className="relative">
                                <Button variant="ghost" size="icon" onClick={() => setShowEmoji(!showEmoji)}>
                                    <Smile size={20} className="text-gray-500" />
                                </Button>
                                {showEmoji && (
                                    <div className="absolute bottom-12 left-0 z-50 shadow-xl border rounded-lg">
                                        <EmojiPicker onEmojiClick={(emojiObject) => {
                                            setInputValue(prev => prev + emojiObject.emoji);
                                            setShowEmoji(false);
                                        }} />
                                    </div>
                                )}
                            </div>
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a reply..."
                                className="flex-1"
                            />
                            <Button onClick={handleSendMessage} size="icon">
                                <Send size={18} />
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <Send size={32} className="text-gray-400 opacity-50" />
                        </div>
                        <p>Select a chat from the sidebar to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatPanel;

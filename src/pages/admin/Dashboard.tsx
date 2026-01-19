
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, Home, FileText, CheckSquare, Layers, Video, Star, MessageSquare, Users, Settings, Grid, Phone, Mail, Menu, X } from 'lucide-react';
import ContactSubmissions from '@/components/admin/ContactSubmissions';
import BlogManager from '@/components/admin/BlogManager';
import AdminManager from '@/components/admin/AdminManager';
import SubscribersManager from '@/components/admin/SubscribersManager';
import AdminChatPanel from '@/components/admin/AdminChatPanel';
import CourseManager from '@/components/admin/CourseManager';
import ServiceManager from '@/components/admin/ServiceManager';
import GalleryManager from '@/components/admin/GalleryManager';
import ReviewManager from '@/components/admin/ReviewManager';
import AdminSettings from '@/components/admin/AdminSettings';
import logo from '@/assets/logo.png';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${active
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/admin/login');
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    if (!user) return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'contacts': return <ContactSubmissions />;
            case 'blogs': return <BlogManager />;
            case 'services': return <ServiceManager />;
            case 'courses': return <CourseManager />;
            case 'gallery': return <GalleryManager />;
            case 'reviews': return <ReviewManager />;
            case 'chat': return <AdminChatPanel />;
            case 'subscribers': return <SubscribersManager />;
            case 'admins': return <AdminManager />;
            case 'settings': return <AdminSettings />;
            default: return (
                <div className="p-4 md:p-8">
                    <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700">Quick Stats</h3>
                            <p className="text-gray-500 mt-2">Check your latest notifications and stats.</p>
                        </div>
                        {/* More widgets can go here */}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 lg:hidden sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <img src={logo} alt="Logo" className="w-8 h-8" />
                    <h1 className="text-xl font-bold text-gray-900">Interman Admin</h1>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActiveTab('settings')}
                >
                    <Settings className="w-6 h-6 text-gray-600" />
                </Button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-50
                transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-sm lg:w-64
                flex flex-col
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-gray-100 shrink-0 bg-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-8 h-8" />
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Interman</h1>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Main
                    </div>
                    <SidebarItem
                        icon={Grid}
                        label="Overview"
                        active={activeTab === 'overview'}
                        onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={Phone}
                        label="Contacts"
                        active={activeTab === 'contacts'}
                        onClick={() => { setActiveTab('contacts'); setIsMobileMenuOpen(false); }}
                    />

                    <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Content
                    </div>
                    <SidebarItem
                        icon={FileText}
                        label="Blogs"
                        active={activeTab === 'blogs'}
                        onClick={() => { setActiveTab('blogs'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={CheckSquare}
                        label="Services"
                        active={activeTab === 'services'}
                        onClick={() => { setActiveTab('services'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={Layers}
                        label="Courses"
                        active={activeTab === 'courses'}
                        onClick={() => { setActiveTab('courses'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={Video}
                        label="Gallery"
                        active={activeTab === 'gallery'}
                        onClick={() => { setActiveTab('gallery'); setIsMobileMenuOpen(false); }}
                    />

                    <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Feedback
                    </div>
                    <SidebarItem
                        icon={Star}
                        label="Reviews"
                        active={activeTab === 'reviews'}
                        onClick={() => { setActiveTab('reviews'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={MessageSquare}
                        label="Live Chat"
                        active={activeTab === 'chat'}
                        onClick={() => { setActiveTab('chat'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={Mail}
                        label="Subscribers"
                        active={activeTab === 'subscribers'}
                        onClick={() => { setActiveTab('subscribers'); setIsMobileMenuOpen(false); }}
                    />

                    <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        System
                    </div>
                    <SidebarItem
                        icon={Users}
                        label="Admins"
                        active={activeTab === 'admins'}
                        onClick={() => { setActiveTab('admins'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        active={activeTab === 'settings'}
                        onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                    />
                </nav>

                <div className="p-4 border-t border-gray-100 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 from-red-50 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 p-4 lg:p-8 overflow-x-hidden w-full">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab !== 'overview' && (
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{activeTab.replace('-', ' ')} Manager</h2>
                        )}
                        {renderContent()}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, push, set, onValue, remove, update } from 'firebase/database';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { Trash2, Edit2, Plus, X, Users, Compass, BookOpen, Building2, Presentation, GraduationCap, Globe, Shield, Award, Heart } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Map of available icons
const ICON_MAP: Record<string, React.ElementType> = {
    Users, Compass, BookOpen, Building2, Presentation, GraduationCap, Globe, Shield, Award, Heart
};

interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    timestamp: number;
    imageUrl?: string;
}

const ServiceManager = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<Service>>({
        title: '',
        description: '',
        icon: 'Users',
        imageUrl: ''
    });

    useEffect(() => {
        const servicesRef = ref(db, 'services_list');
        const unsubscribe = onValue(servicesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setServices(list);
            } else {
                setServices([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const serviceData = {
                title: currentService.title,
                description: currentService.description,
                icon: currentService.icon || 'Users',
                imageUrl: currentService.imageUrl || '',
                timestamp: Date.now()
            };

            if (currentService.id) {
                await update(ref(db, `services_list/${currentService.id}`), serviceData);
                toast.success('Service updated');
            } else {
                await push(ref(db, 'services_list'), serviceData);
                toast.success('Service added');
            }
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save service');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this service?')) {
            try {
                await remove(ref(db, `services_list/${id}`));
                toast.success('Service deleted');
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete service');
            }
        }
    };

    const handleEdit = (service: Service) => {
        setCurrentService(service);
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentService({ title: '', description: '', icon: 'Users', imageUrl: '' });
        setIsEditing(false);
    };

    const IconComponent = ICON_MAP[currentService.icon || 'Users'];

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Service' : 'Add New Service'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Service Title"
                            value={currentService.title}
                            onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                            required
                        />
                        <Select
                            value={currentService.icon}
                            onValueChange={(val) => setCurrentService({ ...currentService, icon: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Icon" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(ICON_MAP).map(iconName => (
                                    <SelectItem key={iconName} value={iconName}>
                                        <div className="flex items-center gap-2">
                                            {React.createElement(ICON_MAP[iconName], { size: 16 })}
                                            {iconName}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Input
                        placeholder="Image URL (Optional)"
                        value={currentService.imageUrl || ''}
                        onChange={(e) => setCurrentService({ ...currentService, imageUrl: e.target.value })}
                    />

                    {currentService.imageUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border">
                            <img src={currentService.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <Textarea
                        placeholder="Service Description"
                        value={currentService.description}
                        onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                        required
                        className="min-h-[100px]"
                    />

                    <div className="flex gap-2">
                        <Button type="submit" className="flex items-center gap-2">
                            {isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                            {isEditing ? 'Update Service' : 'Add Service'}
                        </Button>
                        {isEditing && (
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                    <h3 className="font-semibold">Current Services</h3>
                </div>
                <div className="divide-y">
                    {services.map((service) => {
                        const Icon = ICON_MAP[service.icon] || Users;
                        return (
                            <div key={service.id} className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                        {service.imageUrl ? (
                                            <img
                                                src={service.imageUrl}
                                                alt={service.title}
                                                className="w-8 h-8 object-cover rounded"
                                            />
                                        ) : (
                                            <Icon size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{service.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end md:self-center">
                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(service)}>
                                        <Edit2 size={16} className="text-blue-500" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(service.id)}>
                                        <Trash2 size={16} className="text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                    {services.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No services found. Add one above.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceManager;


import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, push, set, remove, onValue } from 'firebase/database';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Course {
    id: string;
    title: string;
    image: string;
    description: string;
    programs: string[]; // Stored as array, edited as comma-separated string
}

const CourseManager = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({
        title: '',
        image: '',
        description: '',
        programs: []
    });
    const [programInput, setProgramInput] = useState('');

    useEffect(() => {
        const coursesRef = ref(db, 'courses');
        const unsubscribe = onValue(coursesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setCourses(list);
            } else {
                setCourses([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const courseData = {
                title: currentCourse.title,
                image: currentCourse.image,
                description: currentCourse.description || '',
                programs: programInput.split(',').map(p => p.trim()).filter(p => p)
            };

            if (currentCourse.id) {
                // Update
                await set(ref(db, `courses/${currentCourse.id}`), courseData);
                toast.success('Course updated successfully');
            } else {
                // Create
                const newRef = push(ref(db, 'courses'));
                await set(newRef, courseData);
                toast.success('Course created successfully');
            }

            resetForm();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save course');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await remove(ref(db, `courses/${id}`));
                toast.success('Course deleted');
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete course');
            }
        }
    };

    const handleEdit = (course: Course) => {
        setCurrentCourse(course);
        setProgramInput(course.programs ? course.programs.join(', ') : '');
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentCourse({ title: '', image: '', description: '', programs: [] });
        setProgramInput('');
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            {/* Form */}
            <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{isEditing ? 'Edit Course' : 'Add New Course'}</h3>
                    {isEditing && (
                        <Button variant="ghost" size="sm" onClick={resetForm}>
                            <X size={16} className="mr-2" /> Cancel Edit
                        </Button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Course Title (e.g. MEDICAL)"
                            value={currentCourse.title}
                            onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Image URL"
                            value={currentCourse.image}
                            onChange={(e) => setCurrentCourse({ ...currentCourse, image: e.target.value })}
                            required
                        />
                    </div>

                    <Textarea
                        placeholder="Description (Optional)"
                        value={currentCourse.description}
                        onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                    />

                    <div>
                        <label className="text-sm font-medium mb-1 block">Programs (Comma separated)</label>
                        <Textarea
                            placeholder="MBBS, BDS, BAMS..."
                            value={programInput}
                            onChange={(e) => setProgramInput(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Separate specific programs with commas.</p>
                    </div>

                    <Button type="submit" className="w-full md:w-auto">
                        <Plus size={16} className="mr-2" />
                        {isEditing ? 'Update Course' : 'Add Course'}
                    </Button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative h-40">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(course)}>
                                    <Edit2 size={14} />
                                </Button>
                                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(course.id)}>
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-lg mb-2">{course.title}</h4>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{course.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {course.programs && course.programs.slice(0, 5).map((p, i) => (
                                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border">
                                        {p}
                                    </span>
                                ))}
                                {course.programs && course.programs.length > 5 && (
                                    <span className="text-xs text-gray-400 self-center">+{course.programs.length - 5} more</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseManager;

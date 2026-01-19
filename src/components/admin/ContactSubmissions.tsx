
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, remove } from 'firebase/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Submission {
    id: string;
    name: string;
    email: string;
    mobile: string;
    message: string;
    timestamp: number;
}

const ContactSubmissions = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        const submissionsRef = ref(db, 'contact_submissions');
        const unsubscribe = onValue(submissionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                })).sort((a, b) => b.timestamp - a.timestamp);
                setSubmissions(list);
            } else {
                setSubmissions([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                await remove(ref(db, `contact_submissions/${id}`));
                toast.success('Submission deleted');
            } catch (error) {
                console.error('Error deleting submission:', error);
                toast.error('Failed to delete submission');
            }
        }
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">No submissions yet.</TableCell>
                        </TableRow>
                    ) : (
                        submissions.map((submission) => (
                            <TableRow key={submission.id}>
                                <TableCell>{format(submission.timestamp, 'PPpp')}</TableCell>
                                <TableCell>{submission.name}</TableCell>
                                <TableCell>{submission.email}</TableCell>
                                <TableCell>{submission.mobile}</TableCell>
                                <TableCell className="max-w-xs truncate" title={submission.message}>{submission.message}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(submission.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ContactSubmissions;

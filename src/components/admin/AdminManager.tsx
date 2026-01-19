
import React, { useEffect, useState } from 'react';
import { db, firebaseConfig } from '@/lib/firebase';
import { ref, onValue, remove, push, set } from 'firebase/database';
import { initializeApp, getApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, UserPlus, ShieldAlert, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Admin {
    id: string;
    email: string;
    name: string;
    timestamp?: number;
}

const AdminManager = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const adminsRef = ref(db, 'admins');
        const unsubscribeAdmins = onValue(adminsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                setAdmins(list);
            } else {
                setAdmins([]);
            }
        });

        // Fetch Logs
        const logsRef = ref(db, 'admin_logs');
        const unsubscribeLogs = onValue(logsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                // Sort descending
                list.sort((a, b) => b.timestamp - a.timestamp);
                setLogs(list);
            } else {
                setLogs([]);
            }
        });

        return () => {
            unsubscribeAdmins();
            unsubscribeLogs();
        };
    }, []);

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdminEmail || !newAdminPassword || !newAdminName) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newAdminPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        let secondaryApp = null;
        try {
            const secondaryAppName = `secondaryApp-${Date.now()}`;
            secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
            const secondaryAuth = getAuth(secondaryApp);

            await createUserWithEmailAndPassword(secondaryAuth, newAdminEmail, newAdminPassword);
            await signOut(secondaryAuth);

            const newRef = push(ref(db, 'admins'));
            await set(newRef, {
                email: newAdminEmail,
                name: newAdminName,
                timestamp: Date.now(),
                createdBy: 'Admin Panel'
            });

            toast.success(`Admin account created for ${newAdminEmail}`);

            setNewAdminEmail('');
            setNewAdminName('');
            setNewAdminPassword('');

        } catch (error: any) {
            console.error("Error creating admin:", error);

            if (error.code === 'auth/email-already-in-use') {
                if (window.confirm("This email is already registered in Authentication. Do you want to just add them to the Admin access list?")) {
                    const newRef = push(ref(db, 'admins'));
                    await set(newRef, {
                        email: newAdminEmail,
                        name: newAdminName,
                        timestamp: Date.now(),
                        note: 'Added to existing Auth user'
                    });
                    toast.success("Admin access granted to existing user.");
                    setNewAdminEmail('');
                    setNewAdminName('');
                    setNewAdminPassword('');
                }
            } else {
                toast.error(error.message || "Failed to create admin account");
            }
        } finally {
            if (secondaryApp) {
                await deleteApp(secondaryApp);
            }
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (window.confirm(`Remove admin access for ${email}? Note: This will NOT delete their Firebase Auth account, only their admin dashboard access.`)) {
            try {
                await remove(ref(db, `admins/${id}`));
                toast.success('Admin access removed');
            } catch (error) {
                console.error(error);
                toast.error('Failed to remove admin');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <UserPlus className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Create New Admin</h3>
                        <p className="text-sm text-gray-500">Create a new account with email/password and grant admin access.</p>
                    </div>
                </div>

                <form onSubmit={handleAddAdmin} className="space-y-4 max-w-lg">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            placeholder="e.g. John Doe"
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input
                            placeholder="e.g. admin@interman.in"
                            type="email"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            placeholder="Min. 6 characters"
                            type="password"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <UserPlus className="mr-2 h-4 w-4" />}
                        Create Admin Account
                    </Button>
                </form>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                    <h3 className="font-semibold">Current Administrators</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{admins.length} Active</span>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Created</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admins.map((admin) => (
                            <TableRow key={admin.id}>
                                <TableCell className="text-xs text-gray-500">
                                    {admin.timestamp ? new Date(admin.timestamp).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell className="font-medium">{admin.name}</TableCell>
                                <TableCell>{admin.email}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDelete(admin.id, admin.email)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {admins.length === 0 && (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <ShieldAlert className="h-8 w-8 mb-2 text-gray-300" />
                        <p>No admins found. Add one above.</p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                    <h3 className="font-semibold">Recent Login Activity (Last 5)</h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Admin</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Device</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="text-xs text-gray-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell className="font-medium">{log.email}</TableCell>
                                <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                                <TableCell className="text-xs text-gray-500 max-w-[200px] truncate" title={log.device}>
                                    {log.device}
                                </TableCell>
                            </TableRow>
                        ))}
                        {logs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">No login logs found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminManager;

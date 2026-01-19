
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Log the sign-in
            try {
                // Get IP
                const ipRes = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipRes.json();
                const ip = ipData.ip;

                // Get Device
                const device = navigator.userAgent;

                // Import dynamically to avoid top-level issues if any
                const { ref, push, set, get, remove, query, orderByChild, limitToLast } = await import('firebase/database');
                const { db } = await import('@/lib/firebase');

                const logsRef = ref(db, 'admin_logs');
                const newLogRef = push(logsRef);
                await set(newLogRef, {
                    email: user.email,
                    timestamp: Date.now(),
                    ip: ip,
                    device: device
                });

                // Auto-delete older logs (Keep only last 5)
                const snapshot = await get(query(logsRef, orderByChild('timestamp')));
                if (snapshot.exists()) {
                    const logs: { key: string, timestamp: number }[] = [];
                    snapshot.forEach((child) => {
                        logs.push({ key: child.key!, timestamp: child.val().timestamp });
                    });

                    // Sort ascending (oldest first)
                    logs.sort((a, b) => a.timestamp - b.timestamp);

                    // If more than 5, delete the excess from the beginning
                    if (logs.length > 5) {
                        const toDelete = logs.slice(0, logs.length - 5);
                        for (const log of toDelete) {
                            await remove(ref(db, `admin_logs/${log.key}`));
                        }
                    }
                }

            } catch (logError) {
                console.error("Logging failed", logError);
                // Don't block login if logging fails
            }

            toast.success('Logged in successfully');
            navigate('/admin/dashboard');
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to login: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4 flex flex-col items-center">
                    <img src={logo} alt="Logo" className="w-24 h-auto" />
                    <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;

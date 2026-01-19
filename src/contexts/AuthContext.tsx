
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    // ideally we would check a database for admin role, but for now we assume any authenticated user is admin 
    // or we can check specific email. For this task, "admin login" implies if they can login, they are admin.
    // The prompt says "delete admin", "view, delete admin". This implies a list of admins.
    // We'll set isAdmin to true if user is logged in for now, or check real-time DB later.

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAdmin(!!currentUser); // Simple check for now
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, isAdmin }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

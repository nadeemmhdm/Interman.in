
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";

const PageLoader = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);

        // Disable scrolling when loading
        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = 'unset';
        }, 2000);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <>
            {loading && <LoadingScreen />}
            {/* We keep children rendered but maybe hidden or below? 
          If we unmount children, some state might be lost. 
          But typically loading screen overlays everything. 
      */}
            <div style={{ display: loading ? 'none' : 'block' }}>
                {children}
            </div>
        </>
    );
};

export default PageLoader;

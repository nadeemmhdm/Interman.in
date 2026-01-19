
import React from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <motion.img
                    src={logo}
                    alt="Interman Logo"
                    className="w-32 h-auto mb-8"
                    animate={{
                        y: [0, -10, 0],
                        filter: ["brightness(100%)", "brightness(110%)", "brightness(100%)"]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <div className="flex items-center space-x-2">
                    <motion.div
                        className="w-3 h-3 bg-primary rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                        className="w-3 h-3 bg-primary rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                        className="w-3 h-3 bg-primary rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                </div>

                <TypewriterText text="Interman Educational Services..." />
            </motion.div>
        </div>
    );
};

const TypewriterText = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = React.useState('');

    React.useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer); // Or reset to loop
            }
        }, 100);
        return () => clearInterval(timer);
    }, [text]);

    return (
        <motion.p
            className="mt-4 text-lg font-medium text-foreground"
        >
            {displayText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-0.5 h-5 bg-primary ml-1 align-middle"
            />
        </motion.p>
    );
};

export default LoadingScreen;

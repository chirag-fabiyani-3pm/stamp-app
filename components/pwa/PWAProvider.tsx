"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const [isInstallable, setIsInstallable] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isOnline, setIsOnline] = useState(true);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        // Check if the app is already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) {
            console.log('PWA is already installed');
            setIsInstallable(false);
            return;
        }

        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                        console.log('ServiceWorker registration successful:', registration);
                    },
                    (err) => {
                        console.error('ServiceWorker registration failed:', err);
                    }
                );
            });
        }

        // Handle PWA installation
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired');
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
            // Delay showing the install prompt for better UX
            setTimeout(() => setShowInstallPrompt(true), 2000);
        });

        // Handle successful installation
        window.addEventListener('appinstalled', (e) => {
            console.log('PWA was installed');
            setIsInstallable(false);
            setShowInstallPrompt(false);
        });

        // Handle online/offline status
        const handleOnlineStatus = () => {
            const online = navigator.onLine;
            setIsOnline(online);
        };
        
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        handleOnlineStatus();

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        try {
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsInstallable(false);
                setShowInstallPrompt(false);
            }
        } catch (err) {
            console.error('Error during installation:', err);
        }
        setDeferredPrompt(null);
    };

    // Force show for testing
    useEffect(() => {
        const forceShow = !window.matchMedia('(display-mode: standalone)').matches;
        if (forceShow) {
            setIsInstallable(true);
            setTimeout(() => setShowInstallPrompt(true), 2000);
        }
    }, []);

    return (
        <>
            {/* Offline status banner */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-100 text-yellow-800 px-4 py-2 text-center z-50">
                    You are currently offline. Some features may be limited.
                </div>
            )}
            
            {/* Install FAB with tooltip */}
            {isInstallable && showInstallPrompt && (
                <div className="fixed left-6 bottom-6 z-40">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleInstallClick}
                                    size="lg"
                                    className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out animate-fade-in bg-primary hover:bg-primary/90 hover:scale-105"
                                >
                                    <Download className="h-6 w-6" />
                                    <span className="sr-only">Install App</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-primary text-primary-foreground">
                                <p>Install Stamp App</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}
            {children}
        </>
    );
}

// Add this to your globals.css
// @keyframes fade-in {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in {
//   animation: fade-in 0.5s ease-out;
// } 
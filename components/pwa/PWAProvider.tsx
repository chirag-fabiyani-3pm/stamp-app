"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
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
    const [isDismissed, setIsDismissed] = useState(() => {
        // Initialize from session storage
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('pwa-install-dismissed') === 'true';
        }
        return false;
    });

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

    const handleDismiss = () => {
        setIsDismissed(true);
        setShowInstallPrompt(false);
        // Save to session storage
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pwa-install-dismissed', 'true');
        }
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
            {isInstallable && showInstallPrompt && !isDismissed && (
                <div className="fixed left-6 bottom-6 z-40">
                    <div className="relative group">
                        {/* Close button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-4 -right-2 h-5 w-5 rounded-full bg-black/20 hover:bg-black/30 transition-all duration-150 z-10 p-0 opacity-0 group-hover:opacity-100"
                            onClick={handleDismiss}
                        >
                            <X className="h-3 w-3 text-white" />
                            <span className="sr-only">Dismiss install prompt</span>
                        </Button>
                        
                        <TooltipProvider>
                            <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                    <Button
                                        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 hover:scale-105"
                                        size="icon"
                                        onClick={handleInstallClick}
                                    >
                                        <Download className="h-7 w-7" />
                                        <span className="sr-only">Install App</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="left"
                                    className="bg-gradient-to-r from-primary-foreground to-primary-foreground/90 text-muted-foreground font-medium px-3 py-1.5 rounded-lg shadow-xl"
                                >
                                    <p>Install Stamp for offline use</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            )}
            {children}
        </>
    );
}

// Add this to your globals.css
// @keyframes float {
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-8px); }
//   100% { transform: translateY(0px); }
// }
// .animate-float {
//   animation: float 3s ease-in-out infinite;
// } 
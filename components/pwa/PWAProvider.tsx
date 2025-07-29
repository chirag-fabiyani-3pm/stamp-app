"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, X, RotateCcw } from "lucide-react";
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
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
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
        }

        // Register service worker with update handling
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('ServiceWorker registration successful:', registration);
                        setSwRegistration(registration);

                        // Check for updates every 30 seconds
                        setInterval(() => {
                            registration.update();
                        }, 30000);

                        // Listen for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            if (newWorker) {
                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        // New version available
                                        console.log('New version available');
                                        setUpdateAvailable(true);
                                        setShowUpdatePrompt(true);
                                    }
                                });
                            }
                        });
                    })
                    .catch((err) => {
                        console.error('ServiceWorker registration failed:', err);
                    });

                // Listen for service worker messages
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'SW_UPDATED') {
                        console.log('SW Update message received:', event.data.message);
                        setUpdateAvailable(true);
                        setShowUpdatePrompt(true);
                    }
                });

                // Check if there's a waiting service worker
                navigator.serviceWorker.ready.then((registration) => {
                    if (registration.waiting) {
                        setUpdateAvailable(true);
                        setShowUpdatePrompt(true);
                    }
                });
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
        window.addEventListener('appinstalled', () => {
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

    const handleUpdateClick = () => {
        if (swRegistration?.waiting) {
            // Tell the waiting service worker to skip waiting
            swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Force reload the page to activate new service worker
        window.location.reload();
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        setShowInstallPrompt(false);
        // Save to session storage
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pwa-install-dismissed', 'true');
        }
    };

    const handleUpdateDismiss = () => {
        setShowUpdatePrompt(false);
        // Auto-show again after 5 minutes if not updated
        setTimeout(() => {
            if (updateAvailable) {
                setShowUpdatePrompt(true);
            }
        }, 300000); // 5 minutes
    };

    return (
        <>
            {/* Offline status banner */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-100 text-yellow-800 px-4 py-2 text-center z-50">
                    You are currently offline. Some features may be limited.
                </div>
            )}

            {/* Update notification banner */}
            {updateAvailable && showUpdatePrompt && (
                <div className="fixed top-0 left-0 right-0 bg-blue-100 text-blue-800 px-4 py-3 text-center z-50 border-b border-blue-200">
                    <div className="flex items-center justify-center gap-4">
                        <span>A new version is available!</span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={handleUpdateClick}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Update Now
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleUpdateDismiss}
                                className="text-blue-800 hover:bg-blue-200"
                            >
                                Later
                            </Button>
                        </div>
                    </div>
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
"use client"

import { usePathname } from "next/navigation";
import { useCatalogData } from "@/lib/context/catalog-data-context";
import { DataFetchingProgress } from "./catalog/investigate-search/loading-skeletons";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { Spinner } from "./ui/spinner";
import { SubscriptionRequired } from "./subscription/subscription-required";

interface CatalogLayoutWrapperProps {
    children: React.ReactNode
}

const CatalogLayoutPathNames = ['/', '/catalog/country-catalog', '/catalog/visual-catalog', '/catalog/list-catalog', '/catalog/investigate-search']

export function CatalogLayoutWrapper({ children }: CatalogLayoutWrapperProps) {
    const pathName = usePathname();
    const { fetchProgress } = useCatalogData();
    const { isLoading: subscriptionLoading, canAccessFeatures, subscriptionStatus } = useSubscription();

    if (subscriptionLoading) {
        return (
            <div className="flex justify-center items-center h-0 grow overflow-y-auto">
                <Spinner size="lg" />
            </div>
        );
    }

    if(!canAccessFeatures()){
        return <div className="text-foreground h-0 grow overflow-y-auto">
            <SubscriptionRequired userReferralCode={subscriptionStatus.referralByToken || undefined} />
        </div>
    }

    return (
        <>
            {CatalogLayoutPathNames.includes(pathName) && canAccessFeatures() && !subscriptionLoading && <div className="text-foreground h-0 grow overflow-y-auto">
                <div className="relative h-[150px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                    {/* Video Background */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: 'brightness(0.5) contrast(1.1)' }}
                    >
                        <source src="/video/Stamp_Catalogue_Video_Generation_Complete.mp4" type="video/mp4" />
                        {/* Fallback background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
                    </video>

                    {/* Enhanced overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-gray-900/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/40"></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
                                <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">Stamps</span> of Approval
                            </h1>

                            <p className="text-sm text-gray-200 max-w-2xl drop-shadow-lg leading-relaxed">
                                Discover exceptional stamps that have earned collector approval through decades of
                                careful curation. Each specimen represents the finest in philatelic excellence.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <main className="w-full p-4 md:p-10">
                    {fetchProgress.isFetching && (
                        <DataFetchingProgress
                            progress={fetchProgress.progress}
                            totalItems={fetchProgress.totalItems}
                            currentItems={fetchProgress.currentItems}
                            currentPage={fetchProgress.currentPage}
                            totalPages={fetchProgress.totalPages}
                            isComplete={fetchProgress.isComplete}
                        />
                    )}
                    {!fetchProgress.isFetching && children}
                </main>
            </div>}
            {(!CatalogLayoutPathNames.includes(pathName) || !canAccessFeatures()) && !subscriptionLoading && <div className="text-foreground h-0 grow overflow-y-auto">
                {children}
            </div>}
        </>
    )
} 
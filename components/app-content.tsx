"use client"

import React, { useState, createContext, useContext, useEffect } from "react";
import { LayoutWrapper } from "./layout-wrapper";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import Footer from "./footer";
import { Toaster } from "./ui/toaster";
import { useChatContext } from "./chat-provider";
import { CatalogNavbar } from "./catalog-navbar";
import { useSearchParams } from "next/navigation";
import Header from "./header";
import { CatalogLayoutWrapper } from "./catalog-layout-wrapper";
import { isUserLoggedIn } from "@/lib/client/auth-utils";
import { Spinner } from "./ui/spinner";

// Create a context for sidebar state
const SidebarContext = createContext<{
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeSection: 'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection';
}>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => { },
  activeSection: 'countries',
});

export const useSidebarContext = () => useContext(SidebarContext);

interface AppContentProps {
  children: React.ReactNode;
}

// Component to handle search params with Suspense boundary
function SearchParamsHandler({ children }: { children: (initialActiveSection: 'countries' | 'visual' | 'list' | 'investigate') => React.ReactNode }) {
  const searchParams = useSearchParams()
  const initialActiveSection = (searchParams.get('tab') as 'countries' | 'visual' | 'list' | 'investigate') || 'countries'
  return <>{children(initialActiveSection)}</>
}

export function AppContent({ children }: AppContentProps) {
  const { setIsOpen } = useChatContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const isLoggedIn = isAuthenticated();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = isUserLoggedIn();
      setIsLoggedIn(loggedIn);
      setLoading(false);
    };
    checkLoginStatus();
  }, []); 

  if(loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <LayoutWrapper>
        <SearchParamsHandler>
          {(initialActiveSection) => {
            const [activeSection, setActiveSection] = useState<'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection'>(initialActiveSection)

            return (
              <>
                {isLoggedIn ?
                  <SidebarContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed, activeSection }}>
                    <div className="flex min-h-screen">
                      {/* Sidebar - takes fixed width based on collapsed state */}
                      <Sidebar sidebarCollapsed={sidebarCollapsed} setActiveSection={setActiveSection} />

                      {/* Main Content - flexes to fill remaining space */}
                      <div className="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out bg-background">
                        <CatalogNavbar setIsOpen={setIsOpen} isCollapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
                        <MobileNav setIsOpen={setIsOpen} />
                        <CatalogLayoutWrapper>
                          {children}
                        </CatalogLayoutWrapper>
                      </div>
                      <Toaster />
                    </div>
                  </SidebarContext.Provider> :
                  <div className="flex min-h-screen flex-col">
                    <Header setIsOpen={setIsOpen} />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <Toaster />
                  </div>}
              </>
            )
          }}
        </SearchParamsHandler>
    </LayoutWrapper>
  );
} 
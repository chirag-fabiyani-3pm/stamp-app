"use client"

import React, { useState, createContext, useContext } from "react";
import { LayoutWrapper } from "./layout-wrapper";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import Footer from "./footer";
import { Toaster } from "./ui/toaster";
import { useChatContext } from "./chat-provider";
import { isAuthenticated } from "@/lib/api/auth";
import { CatalogNavbar } from "./catalog-navbar";
import { useSearchParams } from "next/navigation";
import Header from "./header";

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

export function AppContent({ children }: AppContentProps) {
  const { setIsOpen } = useChatContext();
  const searchParams = useSearchParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isLoggedIn = isAuthenticated();
  const initialActiveSection = (searchParams.get('tab') as 'countries' | 'visual' | 'list' | 'investigate') || 'countries'
  const [activeSection, setActiveSection] = useState<'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection'>(initialActiveSection)

  return (
    <LayoutWrapper>
      {isLoggedIn ?
        <SidebarContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed, activeSection }}>
          <div className="flex min-h-screen">
            {/* Mobile Navigation */}
            {/* <MobileNav setIsOpen={setIsOpen} /> */}

            {/* Sidebar - takes fixed width based on collapsed state */}
            <Sidebar setIsOpen={setIsOpen} onCollapseChange={setSidebarCollapsed} setActiveSection={setActiveSection} />

            {/* Main Content - flexes to fill remaining space */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out bg-background">
              <CatalogNavbar setIsOpen={setIsOpen} />
              <MobileNav setIsOpen={setIsOpen} />
              <main className="grow h-0 overflow-y-auto">{children}</main>
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
    </LayoutWrapper>
  );
} 
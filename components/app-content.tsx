"use client"

import React, { useState, createContext, useContext } from "react";
import { LayoutWrapper } from "./layout-wrapper";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import Footer from "./footer";
import { Toaster } from "./ui/toaster";
import { useChatContext } from "./chat-provider";
import { isAuthenticated } from "@/lib/api/auth";

// Create a context for sidebar state
const SidebarContext = createContext<{
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

interface AppContentProps {
  children: React.ReactNode;
}

export function AppContent({ children }: AppContentProps) {
  const { setIsOpen } = useChatContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isLoggedIn = isAuthenticated();  

  return (
    <LayoutWrapper>
      <SidebarContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed }}>
        <div className="flex min-h-screen flex-col md:flex-row">
          {/* Mobile Navigation */}
          <MobileNav setIsOpen={setIsOpen} />
          
          {/* Sidebar - takes fixed width based on collapsed state */}
          <Sidebar setIsOpen={setIsOpen} onCollapseChange={setSidebarCollapsed} />
          
          {/* Main Content - flexes to fill remaining space */}
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out bg-background">
            <main className="flex-1">{children}</main>
            {!isLoggedIn && <Footer />}
          </div>
          
          <Toaster />
        </div>
      </SidebarContext.Provider>
    </LayoutWrapper>
  );
} 
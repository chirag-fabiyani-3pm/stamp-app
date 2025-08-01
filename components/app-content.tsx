"use client"

import React from "react";
import { LayoutWrapper } from "./layout-wrapper";
import Header from "./header";
import Footer from "./footer";
import { Toaster } from "./ui/toaster";
import { useChatContext } from "./chat-provider";

interface AppContentProps {
  children: React.ReactNode;
}

export function AppContent({ children }: AppContentProps) {
  const { setIsOpen } = useChatContext();
  return (
    <LayoutWrapper>
      <div className="flex min-h-screen flex-col">
        <Header setIsOpen={setIsOpen} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </div>
    </LayoutWrapper>
  );
} 
"use client"

import React, { createContext, useContext, useState } from 'react'

// Create context for chat state
const ChatContext = createContext<{
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}>({
    isOpen: true,
    setIsOpen: () => { }
})

export const useChatContext = () => useContext(ChatContext)

interface ChatProviderProps {
    children: React.ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
    const [isOpen, setIsOpen] = useState(true) // Start open by default

    return (
        <ChatContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </ChatContext.Provider>
    )
} 
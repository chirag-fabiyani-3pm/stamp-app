"use client"

import React, { createContext, useContext, useState } from 'react'

// Create context for chat state
export const ChatContext = createContext<{
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}>({
    isOpen: false,
    setIsOpen: () => { }
})

interface ChatProviderProps {
    children: React.ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
    const [isOpen, setIsOpen] = useState(false) // Start closed by default

    return (
        <ChatContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext) 
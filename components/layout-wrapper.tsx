"use client"

import { cn } from '@/lib/utils'
import { useChatContext } from './chat-provider'

interface LayoutWrapperProps {
    children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
    const { isOpen } = useChatContext()

    return (
        <div className={cn(
            "transition-all duration-300 ease-in-out",
            isOpen ? "mr-96" : "mr-0"
        )}>
            {children}
        </div>
    )
} 
"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, SendHorizontal, Bot, Sparkles } from "lucide-react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger
} from "@/components/ui/sheet"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export function StampExpertBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your stamp collecting assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Focus input when sheet opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    try {
      // Call the API endpoint
      const response = await fetch('/api/stamp-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          history: messages 
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get response')
      }
      
      const data = await response.json()
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error talking to Stamp Bot:', error)
      toast({
        title: "Something went wrong",
        description: "Unable to get a response. Please try again later.",
        variant: "destructive"
      })
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {/* <Button
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 hover:scale-105" 
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-7 w-7" />
          <span className="sr-only">Open stamp expert chat</span>
        </Button> */}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-[400px] p-0 flex flex-col h-full">
        <SheetHeader className="px-6 py-4 border-b bg-primary/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 bg-primary/10 border-2 border-primary flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </Avatar>
              <div className="space-y-1">
                <SheetTitle className="text-lg flex items-center gap-2">
                  Stamp Expert
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </SheetTitle>
                <Badge variant="outline" className="text-xs font-normal bg-primary/10 text-primary border-primary/20">
                  AI Assistant
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mt-1 bg-primary/10 border-2 border-primary flex-shrink-0 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </Avatar>
                )}
                <div 
                  className={cn(
                    "relative group max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div 
                    className={cn(
                      "absolute bottom-1.5 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]",
                      message.role === 'user' 
                        ? "text-primary-foreground/70" 
                        : "text-muted-foreground"
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-px" />
          </div>
        </ScrollArea>
        
        <div className="px-6 py-4 border-t bg-background">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about stamps..."
              disabled={isLoading}
              className="flex-1 h-11"
            />
            <Button 
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-11 w-11 rounded-full shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendHorizontal className="h-5 w-5" />
              )}
            </Button>
          </form>
          <div className="mt-2.5 text-xs text-center text-muted-foreground">
            Press Enter to send, Shift + Enter for new line
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 
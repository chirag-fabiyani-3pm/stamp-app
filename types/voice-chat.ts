export interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
    structuredData?: any
}

export interface VoiceOption {
    id: string
    name: string
    description: string
}

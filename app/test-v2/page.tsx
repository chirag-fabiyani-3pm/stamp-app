'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestV2Page() {
    const [message, setMessage] = useState('')
    const [response, setResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [testResult, setTestResult] = useState('')

    const testBasicConnection = async () => {
        try {
            setTestResult('Testing basic connection...')
            const res = await fetch('/api/philaguide-v2/test')
            const data = await res.json()
            
            if (data.success) {
                setTestResult(`✅ Connection successful! Response ID: ${data.responseId}`)
            } else {
                setTestResult(`❌ Connection failed: ${data.error}`)
            }
        } catch (error) {
            setTestResult(`❌ Test error: ${error}`)
        }
    }

    const testStreamingAPI = async () => {
        if (!message.trim()) return
        
        setIsLoading(true)
        setResponse('')
        
        try {
            const res = await fetch('/api/philaguide-v2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message, 
                    sessionId: 'test-session',
                    isVoiceChat: false 
                })
            })
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            
            const reader = res.body?.getReader()
            if (!reader) throw new Error('No reader available')
            
            const decoder = new TextDecoder()
            let accumulatedResponse = ''
            
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                
                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6))
                            
                            if (data.type === 'content') {
                                accumulatedResponse += data.content
                                setResponse(accumulatedResponse)
                            } else if (data.type === 'status') {
                                console.log('Status:', data.message)
                            } else if (data.type === 'complete') {
                                console.log('Complete:', data.content)
                                break
                            }
                        } catch (e) {
                            console.log('Parse error:', e)
                        }
                    }
                }
            }
            
        } catch (error) {
            setResponse(`❌ Error: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Philaguide V2 API Test (Responses API)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Button onClick={testBasicConnection} className="mb-4">
                            Test Basic Connection
                        </Button>
                        {testResult && (
                            <div className="p-3 bg-gray-100 rounded">
                                {testResult}
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Input
                            placeholder="Enter your stamp question..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && testStreamingAPI()}
                        />
                        <Button 
                            onClick={testStreamingAPI} 
                            disabled={isLoading || !message.trim()}
                            className="w-full"
                        >
                            {isLoading ? 'Processing...' : 'Test Streaming API'}
                        </Button>
                    </div>
                    
                    {response && (
                        <div className="p-4 bg-gray-50 rounded border">
                            <h3 className="font-semibold mb-2">Response:</h3>
                            <div className="whitespace-pre-wrap">{response}</div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

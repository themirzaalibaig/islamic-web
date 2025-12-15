import { useEffect, useRef } from 'react'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia, Skeleton } from '@/components/ui'
import { MessageSquare, Loader2 } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import type { ChatMessage as ChatMessageType } from '../types'

interface ChatMessagesProps {
  messages: ChatMessageType[]
  isLoading?: boolean
  isSending?: boolean
}

export const ChatMessages = ({ messages, isLoading, isSending }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-24 flex-1 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquare className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>Start a conversation</EmptyTitle>
            <EmptyDescription>
              Ask questions about the Quran, Hadith, or general Islamic knowledge.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      {isSending && (
        <div className="flex items-start gap-3 animate-in fade-in">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          </div>
          <div className="bg-muted rounded-lg px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}


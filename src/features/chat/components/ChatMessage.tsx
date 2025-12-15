import { Card, Badge } from '@/components/ui'
import { User, Bot, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage as ChatMessageType, MessageSource } from '../types'

interface ChatMessageProps {
  message: ChatMessageType
}

const SourceBadge = ({ source }: { source: MessageSource }) => {
  return (
    <Badge variant="outline" className="text-xs">
      <BookOpen className="h-3 w-3 mr-1" />
      {source.reference}
    </Badge>
  )
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <div
        className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          'flex flex-col gap-2 max-w-[85%]',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        <div
          className={cn(
            'rounded-lg px-4 py-2.5',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted',
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.sources && message.sources.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.sources.map((source, index) => (
                <SourceBadge key={index} source={source} />
              ))}
            </div>
          )}
        </div>
        <p
          className={cn(
            'text-xs text-muted-foreground',
            isUser ? 'text-right' : 'text-left',
          )}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}


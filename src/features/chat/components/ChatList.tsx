import { Card, CardContent, CardHeader, CardTitle, Button, Skeleton } from '@/components/ui'
import { MessageSquare, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Chat } from '../types'

interface ChatListProps {
  chats: Chat[]
  selectedChatId: string | null
  onSelectChat: (chatId: string) => void
  onCreateChat: () => void
  onDeleteChat: (chatId: string) => void
  isLoading?: boolean
}

export const ChatList = ({
  chats,
  selectedChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  isLoading,
}: ChatListProps) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversations
          </CardTitle>
          <Button size="sm" onClick={onCreateChat}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">No conversations yet</p>
            <Button size="sm" onClick={onCreateChat}>
              <Plus className="h-4 w-4 mr-2" />
              Start New Conversation
            </Button>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={cn(
                'group relative p-3 rounded-lg border cursor-pointer transition-colors',
                selectedChatId === chat._id
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-accent border-transparent',
              )}
              onClick={() => onSelectChat(chat._id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{chat.title || 'New Conversation'}</h3>
                  {chat.messages.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {chat.messages[chat.messages.length - 1]?.content}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat._id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}


import { useState, useEffect, useCallback } from 'react'
import { Card, Alert, AlertDescription, AlertTitle, Button } from '@/components/ui'
import { AlertCircle, RefreshCw, Trash2 } from 'lucide-react'
import { useChats, useChat, useChatActions, useSendMessage } from '../hooks'
import { ChatList, ChatMessages, ChatInput } from '../components'
import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants'
import type { MessageResponse, SendMessageDto } from '../types'

export const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  const { chats, isLoading: isLoadingChats, isError: isErrorChats, error: chatsError, refetch: refetchChats } = useChats(1, 20)
  const { chat, isLoading: isLoadingChat } = useChat(selectedChatId, !!selectedChatId)
  const { createChat, deleteChat } = useChatActions()
  const { sendMessage, isLoading: isSendingMessage } = useSendMessage(selectedChatId)
  
  // API instance for sending messages to newly created chats
  const messageApi = useApi<MessageResponse>(
    ['chat', 'messages'],
    '',
    {
      auth: true,
      enabled: false,
      silent: true,
    },
  )

  // Auto-select first chat if available
  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      // Use setTimeout to avoid calling setState synchronously in effect
      setTimeout(() => {
        setSelectedChatId(chats[0]._id)
      }, 0)
    }
  }, [chats, selectedChatId])


  const handleCreateChat = useCallback(async () => {
    const { chat: newChat, error } = await createChat()
    if (newChat && !error) {
      setSelectedChatId(newChat._id)
      // Refetch after a delay to avoid race conditions
      setTimeout(() => {
        refetchChats()
      }, 300)
    }
  }, [createChat, refetchChats])

  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId)
  }, [])

  const handleDeleteChat = useCallback(async (chatId: string) => {
    const { error } = await deleteChat(chatId)
    if (!error) {
      if (selectedChatId === chatId) {
        const remainingChats = chats.filter((c) => c._id !== chatId)
        setSelectedChatId(remainingChats.length > 0 ? remainingChats[0]._id : null)
      }
      // Refetch after a delay to avoid race conditions
      setTimeout(() => {
        refetchChats()
      }, 300)
    }
  }, [deleteChat, selectedChatId, chats, refetchChats])

  const handleSendMessage = useCallback(async (message: string) => {
    let chatId = selectedChatId

    // Create a new chat if none is selected
    if (!chatId) {
      const { chat: newChat, error } = await createChat()
      if (newChat && !error) {
        chatId = newChat._id
        setSelectedChatId(chatId)
        // Wait a moment for the chat to be set, then send message
        setTimeout(async () => {
          if (chatId) {
            const payload: SendMessageDto = { message: message.trim() }
            try {
              // Use useApi hook with increased timeout and disabled cancellation
              await messageApi.post<MessageResponse, SendMessageDto>(payload, {
                url: ENDPOINTS.CHAT.SEND_MESSAGE(chatId),
                silent: true,
                // Invalidate queries to trigger refetch (don't manually refetch)
                queryKey: ['chat', chatId, 'chats'],
                disableCancellation: true,
                timeout: 60000, // 60 seconds timeout for AI responses
              })
              // Don't manually refetch - invalidation will handle it
            } catch (error: any) {
              console.error('Failed to send message:', error)
            }
          }
        }, 100)
      }
      return
    }

    // Send message using the hook
    // The hook already invalidates queries, so no need to manually refetch
    await sendMessage(message)
  }, [selectedChatId, createChat, sendMessage, messageApi])

  if (isErrorChats) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {chatsError ? (chatsError as any)?.message || 'Failed to load conversations' : 'Unknown error'}
          </AlertDescription>
          <Button variant="outline" className="mt-4" onClick={() => refetchChats()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Chat List Sidebar */}
      <div className="w-80 shrink-0">
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onCreateChat={handleCreateChat}
          onDeleteChat={handleDeleteChat}
          isLoading={isLoadingChats}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Card className="flex-1 flex flex-col h-full">
          {selectedChatId && chat ? (
            <>
              <div className="border-b p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{chat.title || 'New Conversation'}</h2>
                  <p className="text-sm text-muted-foreground">
                    {chat.messages.length} {chat.messages.length === 1 ? 'message' : 'messages'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteChat(selectedChatId)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
              <ChatMessages
                messages={chat.messages}
                isLoading={isLoadingChat}
                isSending={isSendingMessage}
              />
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isSendingMessage}
                disabled={isLoadingChat}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Select a conversation or start a new one</h3>
                <Button onClick={handleCreateChat}>
                  Start New Conversation
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}


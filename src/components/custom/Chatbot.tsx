import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/features/auth'
import { useChatbot } from './ChatbotContext'
import { useChats, useChat, useChatActions, useSendMessage } from '@/features/chat'
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  BookOpen,
  ScrollText,
  Heart,
  History,
  Trash2,
  Plus,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { ChatMessage, MessageSource } from '@/features/chat/types'

const PREDEFINED_QUESTIONS = [
  {
    id: '1',
    question: 'What is the meaning of Surah Al-Fatiha?',
    category: 'Quran',
    icon: BookOpen,
  },
  {
    id: '2',
    question: 'Tell me a Hadith about patience',
    category: 'Hadith',
    icon: ScrollText,
  },
  {
    id: '3',
    question: 'How to deal with anxiety according to Islam?',
    category: 'Guidance',
    icon: Heart,
  },
  {
    id: '4',
    question: 'What does the Quran say about forgiveness?',
    category: 'Quran',
    icon: BookOpen,
  },
  {
    id: '5',
    question: 'Share a Hadith about gratitude',
    category: 'Hadith',
    icon: ScrollText,
  },
  {
    id: '6',
    question: 'How to find peace in difficult times?',
    category: 'Guidance',
    icon: Heart,
  },
]

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export const Chatbot = () => {
  const { open, setOpen } = useChatbot()
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const { chats, isLoading: isLoadingChats, refetch: refetchChats } = useChats(1, 20)
  const { chat, isLoading: isLoadingChat, refetch: refetchChat } = useChat(currentChatId, !!currentChatId)
  const { createChat, deleteChat } = useChatActions()
  const { sendMessage, isLoading: isSendingMessage } = useSendMessage(currentChatId)

  const username = user?.username || user?.email?.split('@')[0] || 'Guest'
  const greeting = getGreeting()
  const messages = chat?.messages || []
  const isLoading = isLoadingChat || isSendingMessage

  // Auto-select first chat if available
  useEffect(() => {
    if (!currentChatId && chats.length > 0 && open) {
      setTimeout(() => {
        setCurrentChatId(chats[0]._id)
      }, 0)
    }
  }, [chats.length, currentChatId, open])


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when sheet opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [open])

  const createNewSession = useCallback(async () => {
    const { chat: newChat, error } = await createChat()
    if (newChat && !error) {
      setCurrentChatId(newChat._id)
      setShowHistory(false)
      setTimeout(() => {
        refetchChats()
      }, 300)
    }
  }, [createChat, refetchChats])

  const selectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId)
    setShowHistory(false)
  }, [])

  const handleDeleteChat = useCallback(async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const { error } = await deleteChat(chatId)
    if (!error) {
      if (currentChatId === chatId) {
        const remainingChats = chats.filter((c) => c._id !== chatId)
        setCurrentChatId(remainingChats.length > 0 ? remainingChats[0]._id : null)
      }
      setTimeout(() => {
        refetchChats()
      }, 300)
    }
  }, [deleteChat, currentChatId, chats, refetchChats])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    let chatId = currentChatId

    // Create new chat if none exists
    if (!chatId) {
      const { chat: newChat, error } = await createChat()
      if (newChat && !error) {
        chatId = newChat._id
        setCurrentChatId(chatId)
        setTimeout(() => {
          refetchChats()
        }, 300)
      } else {
        return
      }
    }

    const messageText = input.trim()
    setInput('')

    // Send message
    // The hook already invalidates queries, so no need to manually refetch
    await sendMessage(messageText)
  }, [input, isLoading, currentChatId, createChat, sendMessage, refetchChat, refetchChats])

  const handlePredefinedQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearCurrentChat = useCallback(async () => {
    if (currentChatId) {
      const { error } = await deleteChat(currentChatId)
      if (!error) {
        const remainingChats = chats.filter((c) => c._id !== currentChatId)
        setCurrentChatId(remainingChats.length > 0 ? remainingChats[0]._id : null)
        refetchChats()
      }
    }
  }, [currentChatId, deleteChat, chats, refetchChats])

  const hasMessages = messages.length > 0

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-110 transition-transform duration-300 animate-in fade-in zoom-in"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-6 w-6 animate-pulse" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b bg-linear-to-r from-primary/5 to-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                className="hover:bg-accent transition-colors"
              >
                <History className="h-5 w-5 transition-transform hover:rotate-12" />
              </Button>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in">
                <Bot className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <div>
                <SheetTitle className="text-lg">Islamic Assistant</SheetTitle>
                <SheetDescription className="text-xs">
                  Ask about Quran, Hadith, and Islamic guidance
                </SheetDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={createNewSession}
                className="hover:bg-accent transition-colors"
                title="New Chat"
              >
                <Plus className="h-4 w-4 transition-transform hover:rotate-90" />
              </Button>
              {hasMessages && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCurrentChat}
                  className="text-xs hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat History Sidebar */}
          {showHistory && (
            <div className="w-64 border-r bg-muted/30 animate-in slide-in-from-left duration-300">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Chat History
                </h3>
              </div>
              <div className="overflow-y-auto h-full">
                {isLoadingChats ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin opacity-50" />
                    <p>Loading conversations...</p>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No chat history yet</p>
                    <p className="text-xs mt-1">Start a new conversation</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {chats.map((chatItem) => (
                      <div
                        key={chatItem._id}
                        onClick={() => selectChat(chatItem._id)}
                        className={cn(
                          'group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent',
                          currentChatId === chatItem._id && 'bg-accent border border-primary/20',
                          'animate-in fade-in slide-in-from-left',
                        )}
                        style={{
                          animationDelay: `${chats.indexOf(chatItem) * 50}ms`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{chatItem.title || 'New Conversation'}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(chatItem.updatedAt), { addSuffix: true })}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => handleDeleteChat(chatItem._id, e)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              {!hasMessages ? (
                <>
                  {/* Greeting Message */}
                  <div className="flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 animate-in zoom-in">
                      <Bot className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                    <Card className="bg-primary/5 border-primary/20 p-4 max-w-[85%] animate-in slide-in-from-left">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          {greeting}, {username}! 👋
                        </p>
                        <p className="text-sm text-muted-foreground">
                          I'm your Islamic assistant. I can help you with questions about the Quran,
                          Hadith, and provide guidance based on authentic Islamic sources. How can I
                          assist you today?
                        </p>
                      </div>
                    </Card>
                  </div>

                  {/* Predefined Questions */}
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom duration-700">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span>Suggested Questions</span>
                    </div>
                    <div className="grid gap-2">
                      {PREDEFINED_QUESTIONS.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <Button
                            key={item.id}
                            variant="outline"
                            className="h-auto py-3 px-4 justify-start text-left hover:bg-accent hover:scale-[1.02] transition-all duration-200 animate-in fade-in slide-in-from-left"
                            onClick={() => handlePredefinedQuestion(item.question)}
                            style={{
                              animationDelay: `${index * 100}ms`,
                            }}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <Icon className="h-4 w-4 mt-0.5 shrink-0 text-primary transition-transform group-hover:scale-110" />
                              <span className="text-sm flex-1">{item.question}</span>
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Chat Messages */}
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-start gap-3 animate-in fade-in slide-in-from-bottom duration-300',
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                      )}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground animate-in zoom-in'
                            : 'bg-primary/10 text-primary animate-in zoom-in',
                        )}
                      >
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4 animate-pulse" />
                        )}
                      </div>
                      <div
                        className={cn(
                          'max-w-[85%] rounded-lg px-4 py-2.5 animate-in fade-in slide-in-from-bottom',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground slide-in-from-right'
                            : 'bg-muted slide-in-from-left',
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.sources && message.sources.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.sources.map((source: MessageSource, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {source.reference}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p
                          className={cn(
                            'text-xs mt-1.5',
                            message.role === 'user'
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground',
                          )}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start gap-3 animate-in fade-in">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                      <Card className="bg-muted p-4 animate-pulse">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </Card>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-background">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Quran, Hadith, or seek guidance..."
                  disabled={isLoading}
                  className="flex-1 transition-all focus:scale-[1.01]"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0 hover:scale-110 transition-transform duration-200 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 transition-transform hover:translate-x-1" />
                  )}
                </Button>
              </div>
              {hasMessages && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {PREDEFINED_QUESTIONS.slice(0, 3).map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs hover:scale-105 transition-transform"
                      onClick={() => handlePredefinedQuestion(item.question)}
                      disabled={isLoading}
                    >
                      {item.question.split(' ').slice(0, 3).join(' ')}...
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

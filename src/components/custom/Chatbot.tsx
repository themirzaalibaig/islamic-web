import { useState, useRef, useEffect } from 'react'
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
import { useAuth } from '@/features/auth'
import { useChatbot } from './ChatbotContext'
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

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  lastMessageTime: Date
}

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
  const [messages, setMessages] = useState<Message[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const username = user?.username || user?.email?.split('@')[0] || 'Guest'
  const greeting = getGreeting()

  // Load chat sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatbot-sessions')
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions)
        const sessions = parsed.map((session: any) => ({
          ...session,
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
          lastMessageTime: new Date(session.lastMessageTime),
        }))
        setChatSessions(sessions)
      } catch (error) {
        console.error('Error loading chat sessions:', error)
      }
    }
  }, [])

  // Load current session messages
  useEffect(() => {
    if (currentSessionId) {
      const session = chatSessions.find((s) => s.id === currentSessionId)
      if (session) {
        setMessages(session.messages)
      }
    } else {
      setMessages([])
    }
  }, [currentSessionId, chatSessions])

  // Save chat sessions to localStorage
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('chatbot-sessions', JSON.stringify(chatSessions))
    }
  }, [chatSessions])

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

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Mock AI responses based on keywords
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('quran') || lowerMessage.includes('surah') || lowerMessage.includes('verse')) {
      return `Based on the Quran, I can help you understand Islamic teachings. The Quran is the holy book revealed to Prophet Muhammad (peace be upon him). It contains guidance for all aspects of life. 

Would you like me to explain a specific verse or surah? I can provide context and meaning based on authentic Islamic sources.`
    }

    if (lowerMessage.includes('hadith') || lowerMessage.includes('prophet') || lowerMessage.includes('sunnah')) {
      return `Regarding Hadith, I can share authentic sayings and actions of Prophet Muhammad (peace be upon him). 

For example, the Prophet said: "The best of people are those who are most beneficial to others." (Authentic Hadith)

Would you like me to share more Hadith on a specific topic?`
    }

    if (
      lowerMessage.includes('anxiety') ||
      lowerMessage.includes('stress') ||
      lowerMessage.includes('worry') ||
      lowerMessage.includes('problem') ||
      lowerMessage.includes('difficult')
    ) {
      return `In Islam, we are taught to turn to Allah in times of difficulty. The Quran says: "And whoever fears Allah - He will make for him a way out and will provide for him from where he does not expect." (Quran 65:2-3)

The Prophet (peace be upon him) also taught us to pray and be patient. Remember that with every difficulty comes ease. Would you like me to share specific duas or verses that can help?`
    }

    if (lowerMessage.includes('forgiveness') || lowerMessage.includes('forgive')) {
      return `The Quran emphasizes forgiveness greatly. Allah says: "And let them pardon and overlook. Would you not like that Allah should forgive you? And Allah is Forgiving and Merciful." (Quran 24:22)

Forgiveness is a virtue that brings peace to the heart and strengthens relationships. The Prophet (peace be upon him) was known for his forgiving nature.`
    }

    if (lowerMessage.includes('patience') || lowerMessage.includes('sabr')) {
      return `Patience (Sabr) is highly valued in Islam. The Prophet (peace be upon him) said: "How wonderful is the affair of the believer, for his affairs are all good, and this applies to no one but the believer. If something good happens to him, he is thankful for it and that is good for him. If something bad happens to him, he bears it with patience and that is good for him." (Muslim)

The Quran also says: "O you who believe! Seek help through patience and prayer. Indeed, Allah is with the patient." (Quran 2:153)`
    }

    if (lowerMessage.includes('gratitude') || lowerMessage.includes('thankful') || lowerMessage.includes('shukr')) {
      return `Gratitude (Shukr) is essential in Islam. The Prophet (peace be upon him) said: "He who does not thank people, does not thank Allah." (Tirmidhi)

Allah says in the Quran: "If you are grateful, I will surely increase you [in favor]." (Quran 14:7)

Expressing gratitude brings blessings and increases what we have.`
    }

    if (lowerMessage.includes('peace') || lowerMessage.includes('calm')) {
      return `Finding peace comes through remembrance of Allah. The Quran says: "Verily, in the remembrance of Allah do hearts find rest." (Quran 13:28)

Regular prayer, recitation of Quran, and making dua can bring tranquility to the heart. The Prophet (peace be upon him) taught us various supplications for peace and protection.`
    }

    // Default response
    return `Thank you for your question. I'm here to help you with information about the Quran, Hadith, and Islamic guidance.

Based on your question, I can provide insights from authentic Islamic sources. Could you please provide more details about what specific aspect you'd like to know more about?

I can help with:
- Quranic verses and their meanings
- Authentic Hadith
- Islamic guidance for life's challenges
- Spiritual advice based on Quran and Sunnah`
  }

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      lastMessageTime: new Date(),
    }
    setChatSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setMessages([])
    setShowHistory(false)
  }

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    setShowHistory(false)
  }

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null)
      setMessages([])
    }
  }

  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    const title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage
    setChatSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title, lastMessageTime: new Date() } : s)),
    )
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    // Create new session if none exists
    let sessionId = currentSessionId
    if (!sessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: userMessage.content.length > 30 ? userMessage.content.substring(0, 30) + '...' : userMessage.content,
        messages: [userMessage],
        lastMessageTime: new Date(),
      }
      setChatSessions((prev) => [newSession, ...prev])
      sessionId = newSession.id
      setCurrentSessionId(sessionId)
    } else {
      // Update existing session
      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, userMessage], lastMessageTime: new Date() }
            : s,
        ),
      )
      // Update title if it's the first message
      const session = chatSessions.find((s) => s.id === sessionId)
      if (session && session.messages.length === 0) {
        updateSessionTitle(sessionId, userMessage.content)
      }
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await simulateAIResponse(userMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, assistantMessage], lastMessageTime: new Date() }
            : s,
        ),
      )
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

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

  const clearCurrentChat = () => {
    setMessages([])
    if (currentSessionId) {
      setChatSessions((prev) => prev.filter((s) => s.id !== currentSessionId))
      setCurrentSessionId(null)
    }
  }

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
                {chatSessions.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No chat history yet</p>
                    <p className="text-xs mt-1">Start a new conversation</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {chatSessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => selectSession(session.id)}
                        className={cn(
                          'group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent',
                          currentSessionId === session.id && 'bg-accent border border-primary/20',
                          'animate-in fade-in slide-in-from-left',
                        )}
                        style={{
                          animationDelay: `${chatSessions.indexOf(session) * 50}ms`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{session.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(session.lastMessageTime, { addSuffix: true })}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => deleteSession(session.id, e)}
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
                      key={message.id}
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
                        <p
                          className={cn(
                            'text-xs mt-1.5',
                            message.role === 'user'
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground',
                          )}
                        >
                          {message.timestamp.toLocaleTimeString([], {
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

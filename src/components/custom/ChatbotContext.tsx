import { createContext, useContext, useState, ReactNode } from 'react'

interface ChatbotContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)

  return (
    <ChatbotContext.Provider value={{ open, setOpen }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export const useChatbot = () => {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider')
  }
  return context
}


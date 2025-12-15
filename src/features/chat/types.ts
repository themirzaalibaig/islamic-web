import type { ApiResponse, IdentifiableType, TimestampType } from '@/types'

export interface MessageSource {
  type: 'quran' | 'hadith'
  reference: string
  text: string
  metadata?: {
    chapterId?: number
    verseNumber?: number
    collectionName?: string
    bookNumber?: string
    hadithNumber?: string
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: MessageSource[]
  createdAt: string
}

export interface Chat extends IdentifiableType, TimestampType {
  userId: string
  title: string
  messages: ChatMessage[]
  isActive: boolean
}

export interface CreateChatDto {
  title?: string
}

export interface SendMessageDto {
  message: string
}

export interface ChatsResponse extends ApiResponse<{ chats: Chat[] }> {
  chats: Chat[]
}

export interface ChatResponse extends ApiResponse<{ chat: Chat }> {
  chat: Chat
}

export interface MessageResponse extends ApiResponse<{ message: string }> {
  message: string
}


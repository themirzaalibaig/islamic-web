import { useCallback } from 'react'
import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants'
import { useAuth } from '@/features/auth'
import type { ChatResponse, CreateChatDto } from '../types'

export const useChatActions = () => {
  const { isAuthenticated } = useAuth()
  
  const createApi = useApi<ChatResponse>(
    ['chats'],
    ENDPOINTS.CHAT.CREATE(),
    {
      auth: true,
      enabled: false,
      silent: true,
    },
  )

  const createChat = useCallback(
    async (title?: string) => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated')
      }

      try {
        const payload: CreateChatDto = { title }
        const response = await createApi.post<ChatResponse, CreateChatDto>(payload, {
          url: ENDPOINTS.CHAT.CREATE(),
          silent: true,
          queryKey: ['chats'],
        })

        if (response.data?.success && response.data.data?.chat) {
          return { chat: response.data.data.chat, error: undefined }
        }

        return { chat: undefined, error: 'Failed to create chat' }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to create chat'
        return { chat: undefined, error: errorMessage }
      }
    },
    [createApi, isAuthenticated],
  )

  const deleteChat = useCallback(
    async (chatId: string) => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated')
      }

      try {
        await createApi.del({
          url: ENDPOINTS.CHAT.DELETE(chatId),
          silent: true,
          queryKey: ['chats', 'chat'],
        })

        return { error: undefined }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to delete chat'
        return { error: errorMessage }
      }
    },
    [createApi, isAuthenticated],
  )

  const deleteAllChats = useCallback(
    async () => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated')
      }

      try {
        await createApi.del({
          url: ENDPOINTS.CHAT.DELETE_ALL(),
          silent: true,
          queryKey: ['chats'],
        })

        return { error: undefined }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to delete all chats'
        return { error: errorMessage }
      }
    },
    [createApi, isAuthenticated],
  )

  return {
    createChat,
    deleteChat,
    deleteAllChats,
  }
}


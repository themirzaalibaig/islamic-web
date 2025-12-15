import { useCallback, useState } from 'react'
import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants'
import { useAuth } from '@/features/auth'
import type { MessageResponse, SendMessageDto } from '../types'

export const useSendMessage = (chatId: string | null) => {
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const api = useApi<MessageResponse>(
    ['chat', chatId, 'messages'],
    chatId ? ENDPOINTS.CHAT.SEND_MESSAGE(chatId) : '',
    {
      auth: true,
      enabled: false,
      silent: true,
    },
  )

  const sendMessage = useCallback(
    async (message: string) => {
      if (!isAuthenticated || !chatId) {
        throw new Error('Not authenticated or chat ID missing')
      }

      setIsLoading(true)
      try {
        const payload: SendMessageDto = { message: message.trim() }
        const response = await api.post<MessageResponse, SendMessageDto>(payload, {
          url: ENDPOINTS.CHAT.SEND_MESSAGE(chatId),
          silent: true,
          // Invalidate queries to trigger automatic refetch
          queryKey: ['chat', chatId, 'chats'],
          // Disable cancellation and set longer timeout for AI responses
          disableCancellation: true,
          timeout: 60000, // 60 seconds timeout for AI responses
        })

        if (response.data?.success && response.data.data?.message) {
          return { message: response.data.data.message, error: undefined }
        }

        return { message: undefined, error: 'Failed to send message' }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to send message'
        return { message: undefined, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [api, isAuthenticated, chatId],
  )

  return {
    sendMessage,
    isLoading,
    error: api.error,
  }
}


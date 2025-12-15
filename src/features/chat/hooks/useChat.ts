import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants'
import { useAuth } from '@/features/auth'
import type { ChatResponse } from '../types'

export const useChat = (chatId: string | null, enabled: boolean = true) => {
  const { isAuthenticated } = useAuth()

  const api = useApi<ChatResponse>(
    ['chat', chatId],
    chatId ? ENDPOINTS.CHAT.GET_BY_ID(chatId) : '',
    {
      auth: true,
      enabled: enabled && isAuthenticated && !!chatId,
      silent: true,
      queryConfig: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  )

  return {
    chat: api.data?.chat,
    isLoading: api.isLoading,
    isError: api.isError,
    error: api.error,
    refetch: api.refetch,
  }
}


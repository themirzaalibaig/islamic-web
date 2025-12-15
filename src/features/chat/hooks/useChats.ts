import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants'
import { useAuth } from '@/features/auth'
import type { ChatsResponse } from '../types'

export const useChats = (page: number = 1, limit: number = 20) => {
  const { isAuthenticated } = useAuth()

  const api = useApi<ChatsResponse>(
    ['chats', page, limit],
    ENDPOINTS.CHAT.ALL({ page, limit }),
    {
      auth: true,
      enabled: isAuthenticated,
      silent: true,
      queryConfig: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  )

  return {
    chats: api.data?.chats || [],
    pagination: api.meta?.pagination,
    isLoading: api.isLoading,
    isError: api.isError,
    error: api.error,
    refetch: api.refetch,
  }
}


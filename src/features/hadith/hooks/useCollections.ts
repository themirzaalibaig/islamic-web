import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants/endpoint'
import type { Collection } from '../types'

export const useCollections = (enabled: boolean = true) => {
  const { data, isLoading, isError, error, refetch } = useApi<{ collections: Collection[] }>(
    ['hadith', 'collections'],
    ENDPOINTS.HADITH.COLLECTIONS(),
    {
      auth: true,
      enabled,
    },
  )

  return {
    collections: data?.collections,
    isLoading,
    isError,
    error,
    refetch,
  }
}

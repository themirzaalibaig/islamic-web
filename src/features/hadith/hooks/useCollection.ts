import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants/endpoint'
import type { Collection } from '../types'

export const useCollection = (collectionName: string | null, enabled: boolean = true) => {
  const { data, isLoading, isError, error, refetch } = useApi<{ collection: Collection }>(
    ['hadith', 'collection', collectionName],
    collectionName ? ENDPOINTS.HADITH.COLLECTION(collectionName) : '',
    {
      auth: true,
      enabled: enabled && !!collectionName,
    },
  )

  return {
    collection: data?.collection,
    isLoading: isLoading,
    isError: isError,
    error: error,
    refetch: refetch,
  }
}

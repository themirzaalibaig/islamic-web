import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants/endpoint'
import type { Book } from '../types'

export const useBooks = (collectionName: string | null, enabled: boolean = true) => {
  const { data, isLoading, isError, error, refetch } = useApi<{ books: Book[] }>(
    ['hadith', 'books', collectionName],
    collectionName ? ENDPOINTS.HADITH.COLLECTION_BOOKS(collectionName) : '',
    {
      auth: true,
      enabled: enabled && !!collectionName,
    },
  )

  return {
    books: data?.books,
    isLoading: isLoading,
    isError: isError,
    error: error,
    refetch: refetch,
  }
}

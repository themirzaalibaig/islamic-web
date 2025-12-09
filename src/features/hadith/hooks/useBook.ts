import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants/endpoint'
import type { Book } from '../types'

export const useBook = (
  collectionName: string | null,
  bookNumber: string | null,
  enabled: boolean = true,
) => {
  const { data, isLoading, isError, error, refetch } = useApi<{ book: Book }>(
    ['hadith', 'book', collectionName, bookNumber],
    collectionName && bookNumber
      ? ENDPOINTS.HADITH.COLLECTION_BOOK(collectionName, bookNumber)
      : '',
    {
      auth: true,
      enabled: enabled && !!collectionName && !!bookNumber,
    },
  )

  return {
    book: data?.book,
    isLoading: isLoading,
    isError: isError,
    error: error,
    refetch: refetch,
  }
}

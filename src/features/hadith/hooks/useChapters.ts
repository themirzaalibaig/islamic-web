import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants/endpoint'
import type { Chapter } from '../types'

export const useChapters = (
  collectionName: string | null,
  bookNumber: string | null,
  enabled: boolean = true,
) => {
  const { data, isLoading, isError, error, refetch } = useApi<{ chapters: Chapter[] }>(
    ['hadith', 'chapters', collectionName, bookNumber],
    collectionName && bookNumber
      ? ENDPOINTS.HADITH.COLLECTION_BOOK_CHAPTERS(collectionName, bookNumber)
      : '',
    {
      auth: true,
      enabled: enabled && !!collectionName && !!bookNumber,
    },
  )

  return {
    chapters: data?.chapters,
    isLoading: isLoading,
    isError: isError,
    error: error,
    refetch: refetch,
  }
}

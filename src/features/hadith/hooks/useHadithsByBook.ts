import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants/endpoint'
import type { Hadith, PaginatedResponse } from '../types'

export const useHadithsByBook = (
  collectionName: string | null,
  bookNumber: string | null,
  params?: { page?: number; limit?: number },
  enabled: boolean = true,
) => {
  const api = useApi<PaginatedResponse<Hadith>>(
    ['hadith', 'hadiths', collectionName, bookNumber, params],
    collectionName && bookNumber
      ? ENDPOINTS.HADITH.COLLECTION_BOOK_HADITHS(collectionName, bookNumber)
      : '',
    {
      auth: true,
      enabled: enabled && !!collectionName && !!bookNumber,
    },
  )

  return {
    hadiths: api.data?.hadiths,
    total: api.data?.total,
    limit: api.data?.limit,
    previous: api.data?.previous,
    next: api.data?.next,
    isLoading: api.isLoading,
    isError: api.isError,
    error: api.error,
    refetch: api.refetch,
  }
}

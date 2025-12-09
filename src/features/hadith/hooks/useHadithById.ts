import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants/endpoint'
import type { Hadith } from '../types'

export const useHadithById = (
  collectionName: string | null,
  hadithNumber: string | null,
  enabled: boolean = true,
) => {
  const { data, isLoading, isError, error, refetch } = useApi<{ hadith: Hadith }>(
    ['hadith', 'hadith', collectionName, hadithNumber],
    collectionName && hadithNumber
      ? ENDPOINTS.HADITH.COLLECTION_HADITH(collectionName, hadithNumber)
      : '',
    {
      auth: true,
      enabled: enabled && !!collectionName && !!hadithNumber,
    },
  )

  return {
    hadith: data?.hadith,
    isLoading: isLoading,
    isError: isError,
    error: error,
    refetch: refetch,
  }
}

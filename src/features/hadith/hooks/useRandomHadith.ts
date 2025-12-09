import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants/endpoint'
import type { RandomHadith } from '../types'

export const useRandomHadith = (enabled: boolean = true) => {
  const { data, isLoading, isError, error, refetch } = useApi<{ hadith: RandomHadith }>(
    ['hadith', 'random'],
    ENDPOINTS.HADITH.RANDOM_HADITH(),
    {
      auth: true,
      enabled,
    },
  )

  return {
    randomHadith: data?.hadith,
    isLoading: isLoading,
    isError: isError,
    error: error,
    refetch: refetch,
  }
}

import { useMemo } from 'react'
import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants'
import { useAuth } from '@/features/auth'
import type { Dua, DuasResponse, DuaCategoriesResponse } from '../types'
import { SAMPLE_DUAS, DEFAULT_CATEGORIES } from '../constants'

// Check if API endpoint is available (set to true when backend API is ready)
const USE_API = false // Set to true when backend API is ready

export const useDuas = (categoryId?: string) => {
  const { isAuthenticated } = useAuth()

  // Try to use API if available
  const api = useApi<DuasResponse>(
    ['duas', categoryId],
    USE_API ? ENDPOINTS.DUA.ALL({ category: categoryId }) : '',
    {
      auth: true,
      enabled: USE_API && isAuthenticated,
      silent: true,
    },
  )

  // Use sample data if API is not available or not enabled
  const duas = useMemo(() => {
    if (USE_API && api.data?.duas) {
      return api.data.duas
    }
    
    // Fallback to sample data
    if (categoryId) {
      return SAMPLE_DUAS.filter((dua) => dua.categoryId === categoryId)
    }
    return SAMPLE_DUAS
  }, [USE_API, api.data, categoryId])

  const loading = USE_API ? api.isLoading : false
  const error = USE_API ? (api.error ? (api.error as any)?.message || 'Failed to load duas' : null) : null

  return {
    duas,
    loading,
    error,
    refetch: api.refetch,
  }
}

export const useDuaCategories = () => {
  const { isAuthenticated } = useAuth()

  const api = useApi<DuaCategoriesResponse>(
    ['dua-categories'],
    USE_API ? ENDPOINTS.DUA.CATEGORIES() : '',
    {
      auth: true,
      enabled: USE_API && isAuthenticated,
      silent: true,
    },
  )

  const categories = useMemo(() => {
    if (USE_API && api.data?.categories) {
      return api.data.categories
    }
    return DEFAULT_CATEGORIES
  }, [USE_API, api.data])

  return {
    categories,
    loading: USE_API ? api.isLoading : false,
    error: USE_API ? (api.error ? (api.error as any)?.message || 'Failed to load categories' : null) : null,
    refetch: api.refetch,
  }
}

export const useDua = (id: string) => {
  const { isAuthenticated } = useAuth()

  const api = useApi<{ dua: Dua }>(
    ['dua', id],
    USE_API ? ENDPOINTS.DUA.BY_ID(id) : '',
    {
      auth: true,
      enabled: USE_API && isAuthenticated && !!id,
      silent: true,
    },
  )

  const dua = useMemo(() => {
    if (USE_API && api.data?.dua) {
      return api.data.dua
    }
    return SAMPLE_DUAS.find((d) => d._id === id)
  }, [USE_API, api.data, id])

  return {
    dua,
    loading: USE_API ? api.isLoading : false,
    error: USE_API ? (api.error ? (api.error as any)?.message || 'Failed to load dua' : null) : null,
    refetch: api.refetch,
  }
}


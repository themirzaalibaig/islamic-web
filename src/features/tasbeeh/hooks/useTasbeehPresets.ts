import { useCallback, useMemo } from 'react'
import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants'
import { useAuth } from '@/features/auth'
import type { TasbeehPreset, Tasbeeh, TasbeehsResponse, TasbeehResponse, CreateTasbeehDto } from '@/features/tasbeeh/types'

const mapTasbeehToPreset = (tasbeeh: Tasbeeh): TasbeehPreset => {
  const createdAt = tasbeeh.createdAt instanceof Date
    ? tasbeeh.createdAt.toISOString()
    : typeof tasbeeh.createdAt === 'string'
      ? tasbeeh.createdAt
      : undefined

  const updatedAt = tasbeeh.updatedAt instanceof Date
    ? tasbeeh.updatedAt.toISOString()
    : typeof tasbeeh.updatedAt === 'string'
      ? tasbeeh.updatedAt
      : undefined

  return {
    id: tasbeeh._id,
    name: tasbeeh.name,
    text: tasbeeh.text,
    defaultTarget: tasbeeh.target,
    isActive: tasbeeh.isActive,
    createdAt,
    updatedAt,
  }
}

export const useTasbeehPresets = () => {
  const { isAuthenticated } = useAuth()
  
  const api = useApi<TasbeehsResponse>(
    ['tasbeehs'],
    ENDPOINTS.TASBEEH.ALL(),
    {
      auth: true,
      enabled: isAuthenticated,
      silent: true,
    },
  )

  const items = useMemo(() => {
    if (!api.data?.tasbeehs) return []
    return api.data.tasbeehs.map(mapTasbeehToPreset)
  }, [api.data])

  const create = useCallback(
    async (name: string, text: string, defaultTarget: number) => {
      if (!isAuthenticated) return { error: 'Not authenticated' }

      try {
        const payload: CreateTasbeehDto = {
          name: name.trim(),
          text: text.trim(),
          target: defaultTarget,
        }

        const response = await api.post<TasbeehResponse, CreateTasbeehDto>(
          payload,
          {
            url: ENDPOINTS.TASBEEH.CREATE(),
            silent: false,
            queryKey: ['tasbeehs'],
          },
        )

        if (response.data?.success) {
          return { error: undefined }
        }

        return { error: 'Failed to create tasbeeh' }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to create tasbeeh'
        return { error: errorMessage }
      }
    },
    [api, isAuthenticated],
  )

  const update = useCallback(
    async (id: string, payload: { name?: string; text?: string; defaultTarget?: number; isActive?: boolean }) => {
      if (!isAuthenticated) return { error: 'Not authenticated' }

      try {
        const updatePayload: { name?: string; text?: string; target?: number; isActive?: boolean } = {}
        if (payload.name !== undefined) updatePayload.name = payload.name.trim()
        if (payload.text !== undefined) updatePayload.text = payload.text.trim()
        if (payload.defaultTarget !== undefined) updatePayload.target = payload.defaultTarget
        if (payload.isActive !== undefined) updatePayload.isActive = payload.isActive

        const response = await api.put<TasbeehResponse, typeof updatePayload>(
          updatePayload,
          {
            url: ENDPOINTS.TASBEEH.UPDATE(id),
            silent: false,
            queryKey: ['tasbeehs'],
          },
        )

        if (response.data?.success) {
          return { error: undefined }
        }

        return { error: 'Failed to update tasbeeh' }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to update tasbeeh'
        return { error: errorMessage }
      }
    },
    [api, isAuthenticated],
  )

  const remove = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return { error: 'Not authenticated' }

      try {
        await api.del({
          url: ENDPOINTS.TASBEEH.DELETE(id),
          silent: false,
          queryKey: ['tasbeehs'],
        })

        return { error: undefined }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to delete tasbeeh'
        return { error: errorMessage }
      }
    },
    [api, isAuthenticated],
  )

  const value = useMemo(
    () => ({
      items,
      loading: api.isLoading,
      error: api.error ? (api.error as any)?.message || 'Failed to load tasbeehs' : null,
      reload: api.refetch,
      create,
      update,
      remove,
    }),
    [items, api.isLoading, api.error, api.refetch, create, update, remove],
  )

  return value
}

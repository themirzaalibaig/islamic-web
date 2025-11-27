import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/config'
import { useAuth } from '@/features/auth'
import type { TasbeehPreset } from '@/features/tasbeeh/types'

export const useTasbeehPresets = () => {
  const { session } = useAuth()
  const [items, setItems] = useState<TasbeehPreset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!session?.user?.id) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('tasbeeh_presets')
      .select('id,name,text,default_target')
      .eq('user_id', session.user.id)
    if (error) setError(error.message)
    const mapped = Array.isArray(data)
      ? data.map((d: any) => ({
          id: String(d.id),
          name: d.name,
          text: d.text,
          defaultTarget: Number(d.default_target) || 33,
        }))
      : []
    setItems(mapped)
    setLoading(false)
  }, [session])

  useEffect(() => {
    load()
  }, [load])

  const create = useCallback(
    async (name: string, text: string, defaultTarget: number) => {
      if (!session?.user?.id) return { error: 'Not authenticated' }
      const { data, error } = await supabase
        .from('tasbeeh_presets')
        .insert({ user_id: session.user.id, name, text, default_target: defaultTarget })
        .select('id,name,text,default_target')
        .single()
      if (error) return { error: error.message }
      setItems((prev) => [
        ...prev,
        {
          id: String((data as any).id),
          name: (data as any).name,
          text: (data as any).text,
          defaultTarget: Number((data as any).default_target) || defaultTarget,
        },
      ])
      return { error: undefined }
    },
    [session],
  )

  const value = useMemo(
    () => ({ items, loading, error, reload: load, create }),
    [items, loading, error, load, create],
  )
  return value
}

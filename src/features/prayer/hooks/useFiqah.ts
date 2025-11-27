import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/config'
import { useAuth } from '@/features/auth'
import { Madhab } from 'adhan'

export type FiqahInfo = {
  id: number | string
  name: string
  madhab: typeof Madhab
}

const resolveMadhab = (name?: string | null): typeof Madhab => {
  const n = (name || '').toLowerCase().trim()
  if (n.includes('hanafi')) return Madhab.Hanafi as any
  return Madhab.Shafi as any
}

export const useFiqah = () => {
  const { session } = useAuth()
  const [fiqah, setFiqah] = useState<FiqahInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!session?.user?.id) return
    setLoading(true)
    setError(null)
    try {
      const { data: userRow } = await supabase
        .from('users')
        .select('fiqah,user_id')
        .eq('user_id', session.user.id)
        .single()

      const fiqahId = (userRow as any)?.fiqah
      if (!fiqahId) {
        setFiqah(null)
        setLoading(false)
        return
      }
      const { data: fiqhRow } = await supabase
        .from('fiqa')
        .select('id,name')
        .eq('id', fiqahId)
        .single()
      const name = (fiqhRow as any)?.name as string | undefined
      const info: FiqahInfo = {
        id: fiqahId,
        name: name || 'Shafi',
        madhab: resolveMadhab(name),
      }
      setFiqah(info)
    } catch (e: any) {
      setError(e?.message || 'Failed to load fiqah')
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    load()
  }, [load])

  const value = useMemo(
    () => ({ fiqah, loading, error, reload: load }),
    [fiqah, loading, error, load],
  )
  return value
}

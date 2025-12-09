import { useMemo } from 'react'
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
  const { user, isAuthenticated } = useAuth()

  const fiqah = useMemo<FiqahInfo | null>(() => {
    if (!isAuthenticated || !user?.fiqh) {
      return null
    }

    const fiqhName = user.fiqh
    return {
      id: fiqhName,
      name: fiqhName,
      madhab: resolveMadhab(fiqhName),
    }
  }, [user, isAuthenticated])

  return {
    fiqah,
    loading: false,
    error: null,
    reload: () => {},
  }
}

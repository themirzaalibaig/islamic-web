import { useEffect, useMemo, useState } from 'react'

export type Surah = {
  id: number
  name_simple: string
  name_arabic: string
  verses_count: number
  revelation_place: 'makkah' | 'madinah'
  revelation_order: number
  translated_name?: { name?: string }
}

export type Verse = {
  id: number
  verse_key: string
  verse_number?: number
  text_uthmani?: string
  text?: string
  translations?: Array<{ text?: string }>
}

const API_BASE = 'https://api.quran.com/api/v4'

export function useQuranData(defaultChapterId?: number) {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null)
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [translationLang, setTranslationLang] = useState<'en' | 'ur'>('en')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true
    const fetchSurahs = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE}/chapters?language=en`)
        if (!res.ok) throw new Error('Failed to fetch surahs')
        const data = await res.json()
        if (!active) return
        setSurahs((data.chapters || []) as Surah[])
      } catch (e) {
        if (!active) return
        setError('Failed to load surahs. Please try again later.')
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchSurahs()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (surahs.length === 0) return
    const chapterId = defaultChapterId || 1
    fetchVerses(chapterId)
  }, [surahs, defaultChapterId])

  const fetchVerses = async (chapterId: number) => {
    setLoading(true)
    try {
      const translationIdMap: Record<'en' | 'ur', number> = { en: 20, ur: 167 }
      const res = await fetch(
        `${API_BASE}/verses/by_chapter/${chapterId}?language=${translationLang}&translations=${translationIdMap[translationLang]}&fields=text_uthmani&per_page=all`
      )
      if (!res.ok) throw new Error('Failed to fetch verses')
      const data = await res.json()
      setVerses((data.verses || []) as Verse[])
      setSelectedSurah(surahs.find((s) => s.id === chapterId) || null)
    } catch (e) {
      setError('Failed to load verses. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filteredSurahs = useMemo(
    () => surahs.filter((s) => s.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toString().includes(searchQuery)),
    [surahs, searchQuery]
  )

  return {
    surahs,
    selectedSurah,
    verses,
    loading,
    error,
    translationLang,
    searchQuery,
    setSearchQuery,
    setTranslationLang,
    fetchVerses,
    filteredSurahs,
  }
}


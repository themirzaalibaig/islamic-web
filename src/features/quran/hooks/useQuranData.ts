import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
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
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null)
  const [verses, setVerses] = useState<Verse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data,
    isLoading: surahsLoading,
    isError: surahsError,
  } = useQuery<{ chapters: Surah[] }>({
    queryKey: ['surahs'],
    queryFn: async () => {
      const { data } = await axios.get<{ chapters: Surah[] }>(`${API_BASE}/chapters`, {
        params: { language: 'en' },
      })
      return data
    },
  })

  const surahs = data?.chapters || []

  const {
    data: versesData,
    isLoading: versesLoading,
    isError: versesError,
  } = useQuery<{ verses: Verse[] }>({
    queryKey: ['verses', selectedSurah?.id],
    queryFn: async () => {
      if (!selectedSurah) return { verses: [] }
      const { data } = await axios.get<{ verses: Verse[] }>(
        `${API_BASE}/verses/by_chapter/${selectedSurah.id}?fields=text_uthmani&per_page=all`,
      )
      return data
    },
    enabled: !!selectedSurah,
  })

  useEffect(() => {
    if (surahs.length === 0) return
    const chapterId = defaultChapterId || 1
    const surah = surahs.find((s) => s.id === chapterId) || null
    setSelectedSurah(surah)
  }, [surahs, defaultChapterId])

  useEffect(() => {
    if (versesData?.verses) {
      setVerses(versesData.verses)
    }
  }, [versesData])

  useEffect(() => {
    if (surahsError || versesError) {
      setError('Failed to load data. Please try again later.')
    } else {
      setError(null)
    }
  }, [surahsError, versesError])

  const fetchVerses = (chapterId: number) => {
    const surah = surahs.find((s) => s.id === chapterId) || null
    setSelectedSurah(surah)
  }

  const filteredSurahs = useMemo(
    () =>
      surahs.filter(
        (s) =>
          s.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.toString().includes(searchQuery),
      ),
    [surahs, searchQuery],
  )

  return {
    surahs,
    selectedSurah,
    verses,
    loading: surahsLoading || versesLoading,
    error,
    searchQuery,
    setSearchQuery,
    fetchVerses,
    filteredSurahs,
  }
}

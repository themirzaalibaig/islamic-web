import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'

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

  const surahs = useMemo(() => data?.chapters || [], [data?.chapters])

  // Derive selected surah from surahs and defaultChapterId
  const selectedSurah = useMemo(() => {
    if (surahs.length === 0) return null
    const chapterId = defaultChapterId || 1
    return surahs.find((s) => s.id === chapterId) || null
  }, [surahs, defaultChapterId])

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

  // Derive verses from versesData
  const verses = useMemo(() => versesData?.verses || [], [versesData?.verses])

  // Derive error from query errors
  const error = useMemo(() => {
    if (surahsError || versesError) {
      return 'Failed to load data. Please try again later.'
    }
    return null
  }, [surahsError, versesError])

  const [selectedSurahState, setSelectedSurahState] = useState<Surah | null>(selectedSurah)

  // Sync selectedSurahState with derived selectedSurah only when it changes
  useEffect(() => {
    setSelectedSurahState(selectedSurah)
  }, [selectedSurah])

  const fetchVerses = useCallback((chapterId: number) => {
    const surah = surahs.find((s) => s.id === chapterId) || null
    setSelectedSurahState(surah)
  }, [surahs])

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
    selectedSurah: selectedSurahState,
    verses,
    loading: surahsLoading || versesLoading,
    error,
    searchQuery,
    setSearchQuery,
    fetchVerses,
    filteredSurahs,
  }
}

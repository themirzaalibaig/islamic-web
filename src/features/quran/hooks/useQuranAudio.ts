import { useEffect, useRef, useState } from 'react'
import type { Surah } from './useQuranData'

const API_BASE = 'https://api.quran.com/api/v4'

const reciterMap: Record<string, string> = {
  '7': 'ar.alafasy',
  '1': 'ar.abdurrahmaansudais',
  '3': 'ar.abdurrahmaansudais',
  '5': 'ar.saadAlghamdi',
  '2': 'ar.abdulbasitmurattal',
  '4': 'ar.husary',
  '6': 'ar.minshawi',
  '8': 'ar.shaatree',
  '9': 'ar.hudhaify',
  '10': 'ar.banna',
  '11': 'ar.muayqali',
  '12': 'ar.ayyoub',
  '13': 'ar.rifai',
}

export function useQuranAudio() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [reciterId, setReciterId] = useState<string>('7')
  const [playingVerseKey, setPlayingVerseKey] = useState<string | null>(null)
  const [isVersePlaying, setIsVersePlaying] = useState(false)
  const [isSurahPlaying, setIsSurahPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [currentAudio, setCurrentAudio] = useState<{
    type: 'surah' | 'verse' | null
    isPlaying: boolean
    surahName: string
    verseKey: string
    audioElement: HTMLAudioElement | null
    progress: number
    duration: number
    currentTime: number
  }>({
    type: null,
    isPlaying: false,
    surahName: '',
    verseKey: '',
    audioElement: null,
    progress: 0,
    duration: 0,
    currentTime: 0,
  })

  const surahAudioRef = useRef<HTMLAudioElement | null>(null)
  const verseAudioRef = useRef<HTMLAudioElement | null>(null)

  const loadSurahAudio = async (chapterId: number, surahs: Surah[]) => {
    // Pause any currently playing audio
    currentAudio.audioElement?.pause()
    setIsSurahPlaying(false)
    setIsVersePlaying(false)
    setPlayingVerseKey(null)

    const res = await fetch(`${API_BASE}/chapter_recitations/${reciterId}/${chapterId}`)
    if (!res.ok) throw new Error('Failed to load audio')
    const data = await res.json()
    const url = data.audio_file?.audio_url || null
    setAudioUrl(url)
    const surah = surahs.find((s) => s.id === chapterId)
    // Bind the audio element's src immediately so play controls work
    if (surahAudioRef.current && url) {
      surahAudioRef.current.src = url
      surahAudioRef.current.currentTime = 0
    }
    setCurrentAudio((prev) => ({
      ...prev,
      type: 'surah',
      isPlaying: false,
      surahName: surah?.name_simple || '',
      verseKey: '',
      audioElement: surahAudioRef.current,
      progress: 0,
      duration: 0,
      currentTime: 0,
    }))
  }

  const toggleSurahPlayback = (surahName?: string) => {
    const el = surahAudioRef.current
    if (!el || !audioUrl) return
    if (el.paused) {
      el.playbackRate = playbackSpeed
      el.play()
      setIsSurahPlaying(true)
      setCurrentAudio({
        type: 'surah',
        isPlaying: true,
        surahName: surahName || '',
        verseKey: '',
        audioElement: el,
        progress: 0,
        duration: el.duration || 0,
        currentTime: el.currentTime || 0,
      })
    } else {
      el.pause()
      setCurrentAudio((prev) => ({ ...prev, isPlaying: false }))
    }
  }

  const playVerseAudio = async (verseKey: string, surahs: Surah[]) => {
    const audio = verseAudioRef.current
    const surahId = parseInt(verseKey.split(':')[0] || '0', 10)
    const surah = surahs.find((s) => s.id === surahId)
    if (playingVerseKey === verseKey && isVersePlaying) {
      audio?.pause()
      setIsVersePlaying(false)
      setCurrentAudio((prev) => ({ ...prev, isPlaying: false }))
      return
    }
    const edition = reciterMap[reciterId] || 'ar.alafasy'
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${verseKey}/${edition}`)
    if (!res.ok) throw new Error('Failed to load verse audio')
    const data = await res.json()
    if (data.code === 200 && data.data.audio) {
      setPlayingVerseKey(verseKey)
      setIsVersePlaying(true)
      setCurrentAudio({
        type: 'verse',
        isPlaying: true,
        surahName: surah?.name_simple || '',
        verseKey,
        audioElement: audio,
        progress: 0,
        duration: 0,
        currentTime: 0,
      })
      if (audio) {
        audio.src = data.data.audio as string
        audio.playbackRate = playbackSpeed
        audio.play()
      }
    }
  }

  const handleReciterChange = async (
    newId: string,
    selectedSurah?: Surah | null,
    surahs: Surah[] = [],
  ) => {
    const wasPlayingSurah = currentAudio.type === 'surah' && currentAudio.isPlaying
    // Stop existing audio immediately
    currentAudio.audioElement?.pause()
    verseAudioRef.current?.pause()
    setIsSurahPlaying(false)
    setIsVersePlaying(false)
    setPlayingVerseKey(null)

    setReciterId(newId)
    if (selectedSurah) {
      await loadSurahAudio(selectedSurah.id, surahs)
      if (wasPlayingSurah && surahAudioRef.current) {
        surahAudioRef.current.playbackRate = playbackSpeed
        void surahAudioRef.current.play()
        setIsSurahPlaying(true)
        setCurrentAudio((prev) => ({
          ...prev,
          isPlaying: true,
          audioElement: surahAudioRef.current,
        }))
      }
    }
  }

  const setPlayback = (speed: number) => {
    setPlaybackSpeed(speed)
  }

  useEffect(() => {
    const el = currentAudio.audioElement
    if (el) {
      // Modifying DOM element property, not React state
      // eslint-disable-next-line
      el.playbackRate = playbackSpeed
    }
  }, [playbackSpeed, currentAudio.audioElement])

  const syncProgress = () => {
    const el = currentAudio.audioElement
    if (!el || isNaN(el.duration)) return
    const prog = (el.currentTime / el.duration) * 100
    setCurrentAudio((prev) => ({
      ...prev,
      progress: prog,
      currentTime: el.currentTime,
      duration: el.duration,
    }))
  }

  const refreshCurrentAudio = () => {
    const el = currentAudio.audioElement
    if (!el) return
    // Modifying DOM element properties, not React state
    // eslint-disable-next-line
    el.currentTime = 0
    el.playbackRate = playbackSpeed
    if (currentAudio.type === 'surah' && audioUrl && surahAudioRef.current) {
      surahAudioRef.current.src = audioUrl
    }
    if (currentAudio.isPlaying) {
      void el.play()
    }
    setCurrentAudio((prev) => ({ ...prev, progress: 0, currentTime: 0 }))
  }

  return {
    audioUrl,
    reciterId,
    playingVerseKey,
    isVersePlaying,
    isSurahPlaying,
    playbackSpeed,
    currentAudio,
    surahAudioRef,
    verseAudioRef,
    loadSurahAudio,
    toggleSurahPlayback,
    playVerseAudio,
    handleReciterChange,
    setPlayback,
    syncProgress,
    refreshCurrentAudio,
  }
}

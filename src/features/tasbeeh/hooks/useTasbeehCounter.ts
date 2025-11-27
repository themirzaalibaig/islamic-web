import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { TasbeehPreset } from '@/features/tasbeeh/types'
import { useLocalStorage } from '@reactuses/core'
import { useTasbeehPresets } from '@/features/tasbeeh/hooks'

const PRESETS: TasbeehPreset[] = [
  { id: 'subhanallah', name: 'SubhanAllah', text: 'سُبْحَانَ اللّٰهِ', defaultTarget: 33 },
  { id: 'alhamdulillah', name: 'Alhamdulillah', text: 'اَلْحَمْدُ لِلّٰهِ', defaultTarget: 33 },
  { id: 'allahu-akbar', name: 'Allahu Akbar', text: 'اَللّٰهُ أَكْبَرُ', defaultTarget: 34 },
  {
    id: 'la-ilaha',
    name: 'La ilaha illallah',
    text: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    defaultTarget: 100,
  },
  {
    id: 'astaghfirullah',
    name: 'Astaghfirullah',
    text: 'أَسْتَغْفِرُ اللّٰهَ',
    defaultTarget: 100,
  },
  { id: 'salawat', name: 'Salawat', text: 'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ', defaultTarget: 100 },
]

type UseTasbeehOptions = {
  initialPresetId?: string
}

export const useTasbeehCounter = (options?: UseTasbeehOptions) => {
  const { items: customPresets } = useTasbeehPresets()
  const [presetId, setPresetId] = useLocalStorage<string>(
    'tasbeeh:preset',
    options?.initialPresetId || PRESETS[0].id,
  )
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>('tasbeeh:sound', true)
  const [vibrateEnabled, setVibrateEnabled] = useLocalStorage<boolean>('tasbeeh:vibrate', false)
  const [target, setTarget] = useLocalStorage<number>(
    `tasbeeh:target:${presetId}`,
    PRESETS[0].defaultTarget,
  )
  const [count, setCount] = useLocalStorage<number>(`tasbeeh:count:${presetId}`, 0)
  const [rounds, setRounds] = useLocalStorage<number>(`tasbeeh:rounds:${presetId}`, 0)

  const audioCtxRef = useRef<AudioContext | null>(null)

  const allPresets = useMemo<TasbeehPreset[]>(() => {
    const customs = Array.isArray(customPresets) ? customPresets : []
    return [...customs, ...PRESETS]
  }, [customPresets])
  const preset = useMemo(
    () => allPresets.find((x) => x.id === presetId) || allPresets[0] || PRESETS[0],
    [presetId, allPresets],
  )
  const safeTarget = useMemo<number>(() => {
    const valid = typeof target === 'number' && isFinite(target) && target > 0
    const base = valid ? target : preset.defaultTarget
    return Number(base)
  }, [target, preset])

  const initAudio = useCallback(() => {
    if (!soundEnabled) return
    if (audioCtxRef.current) return
    try {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch {}
  }, [soundEnabled])

  const playSound = useCallback(() => {
    if (!soundEnabled) return
    const ctx = audioCtxRef.current
    if (!ctx) return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 600
    g.gain.value = 0.02
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    setTimeout(() => {
      o.stop()
      o.disconnect()
      g.disconnect()
    }, 80)
  }, [soundEnabled])

  const vibrate = useCallback(() => {
    if (!vibrateEnabled) return
    if ('vibrate' in navigator) navigator.vibrate(20)
  }, [vibrateEnabled])

  const increment = useCallback(() => {
    initAudio()
    setCount((c) => {
      const cur = typeof c === 'number' ? c : 0
      const next = cur + 1
      if (next >= safeTarget) {
        setRounds((r) => (typeof r === 'number' ? r : 0) + 1)
        playSound()
        vibrate()
        return 0
      }
      playSound()
      vibrate()
      return next
    })
  }, [initAudio, safeTarget, playSound, vibrate])

  const decrement = useCallback(() => {
    setCount((c) => Math.max((typeof c === 'number' ? c : 0) - 1, 0))
  }, [])

  const reset = useCallback(() => {
    setCount(0)
    setRounds(0)
  }, [])

  const selectPreset = useCallback(
    (id: string) => {
      setPresetId(id)
    },
    [setPresetId],
  )

  const toggleSound = useCallback(() => setSoundEnabled((v) => !v), [])
  const toggleVibrate = useCallback(() => setVibrateEnabled((v) => !v), [])

  useEffect(() => {
    setCount(0)
    setTarget(preset.defaultTarget)
  }, [presetId])

  const value = useMemo(
    () => ({
      count,
      target: safeTarget,
      rounds,
      preset,
      presets: allPresets,
      defaultPresets: PRESETS,
      soundEnabled,
      vibrateEnabled,
      increment,
      decrement,
      reset,
      setTarget: (n: number) => setTarget(Number(n) || preset.defaultTarget),
      selectPreset,
      toggleSound,
      toggleVibrate,
    }),
    [
      count,
      safeTarget,
      rounds,
      preset,
      soundEnabled,
      vibrateEnabled,
      increment,
      decrement,
      reset,
      setTarget,
      selectPreset,
      toggleSound,
      toggleVibrate,
      allPresets,
    ],
  )

  return value
}

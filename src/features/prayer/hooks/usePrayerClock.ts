import { useEffect, useMemo, useState, useCallback } from 'react'
import type { Coordinates } from './useGeolocation'
import { CalculationMethod, Coordinates as AdhanCoordinates, Prayer, PrayerTimes } from 'adhan'

const toAdhanCoords = (coords: Coordinates) => new AdhanCoordinates(coords.latitude, coords.longitude)

export type PrayerClock = {
  now: Date
  currentPrayer: any | null
  nextPrayer: any | null
  nextPrayerTime: Date | null
  currentStart: Date | null
  currentEnd: Date | null
  progress: number
  timeLeftMs: number
}

export const usePrayerClock = (coords: Coordinates | null, madhab: any | null) => {
  const [now, setNow] = useState<Date>(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const buildParams = useCallback(() => {
    const params = CalculationMethod.MoonsightingCommittee()
    if (madhab) params.madhab = madhab
    return params
  }, [madhab])

  const value = useMemo<PrayerClock>(() => {
    if (!coords || !madhab) {
      return {
        now,
        currentPrayer: null,
        nextPrayer: null,
        nextPrayerTime: null,
        currentStart: null,
        currentEnd: null,
        progress: 0,
        timeLeftMs: 0,
      }
    }

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const pt = new PrayerTimes(toAdhanCoords(coords), today, buildParams())
    const current = pt.currentPrayer()
    let next = pt.nextPrayer()
    let nextTime = next ? pt.timeForPrayer(next) : null
    if (!next || !nextTime) {
      const nextDay = new Date(today)
      nextDay.setDate(today.getDate() + 1)
      const nextPt = new PrayerTimes(toAdhanCoords(coords), nextDay, buildParams())
      next = Prayer.Fajr
      nextTime = nextPt.fajr
    }

    const start = current ? pt.timeForPrayer(current) : null
    const end = (() => {
      if (!current) return null
      if (current === Prayer.Isha) {
        const nextDay = new Date(today)
        nextDay.setDate(today.getDate() + 1)
        const nextPt = new PrayerTimes(toAdhanCoords(coords), nextDay, buildParams())
        return nextPt.fajr
      }
      if (current === Prayer.Fajr) return pt.sunrise
      const order = [Prayer.Fajr, Prayer.Sunrise, Prayer.Dhuhr, Prayer.Asr, Prayer.Maghrib, Prayer.Isha] as any[]
      const idx = order.indexOf(current)
      const np = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null
      return np ? pt.timeForPrayer(np) : null
    })()

    const progress = 0

    const timeLeftMs = nextTime ? Math.max(nextTime.getTime() - now.getTime(), 0) : 0

    return {
      now,
      currentPrayer: current,
      nextPrayer: next,
      nextPrayerTime: nextTime,
      currentStart: start,
      currentEnd: end,
      progress,
      timeLeftMs,
    }
  }, [coords, madhab, now, buildParams])

  return value
}

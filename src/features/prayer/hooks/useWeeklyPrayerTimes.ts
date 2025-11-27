import { useMemo } from 'react'
import type { Coordinates } from './useGeolocation'
import { CalculationMethod, Coordinates as AdhanCoordinates, PrayerTimes } from 'adhan'

export type WeeklyDayTimes = {
  date: Date
  fajr: Date
  sunrise: Date
  dhuhr: Date
  asr: Date
  maghrib: Date
  isha: Date
}

const toAdhanCoords = (coords: Coordinates) => new AdhanCoordinates(coords.latitude, coords.longitude)

export const useWeeklyPrayerTimes = (
  coords: Coordinates | null,
  madhab: any | null,
  days: number = 7,
) => {
  const list = useMemo<WeeklyDayTimes[] | null>(() => {
    if (!coords || !madhab) return null
    const params = CalculationMethod.MoonsightingCommittee()
    if (madhab) (params as any).madhab = madhab
    const base = new Date()
    const start = new Date(base.getFullYear(), base.getMonth(), base.getDate())
    const out: WeeklyDayTimes[] = []
    for (let i = 0; i < days; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const pt = new PrayerTimes(toAdhanCoords(coords), d, params)
      out.push({
        date: d,
        fajr: pt.fajr,
        sunrise: pt.sunrise,
        dhuhr: pt.dhuhr,
        asr: pt.asr,
        maghrib: pt.maghrib,
        isha: pt.isha,
      })
    }
    return out
  }, [coords, madhab, days])

  return list
}

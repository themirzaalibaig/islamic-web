import { useMemo } from 'react'
import type { Coordinates } from './useGeolocation'
import { CalculationMethod, Coordinates as AdhanCoordinates, Madhab, Prayer, PrayerTimes } from 'adhan'

export type DailyPrayerTimes = {
  fajr: Date
  sunrise: Date
  dhuhr: Date
  asr: Date
  maghrib: Date
  isha: Date
}

export type CalculatedPrayerMeta = {
  currentPrayer: Prayer | null
  nextPrayer: Prayer | null
  previousPrayer: Prayer | null
}

const toAdhanCoords = (coords: Coordinates) => new AdhanCoordinates(coords.latitude, coords.longitude)

export const usePrayerTimes = (coords: Coordinates | null, madhab: Madhab | null) => {
  const result = useMemo(() => {
    if (!coords || !madhab) return null as
      | null
      | {
          times: DailyPrayerTimes
          meta: CalculatedPrayerMeta
        }
    const date = new Date()
    const parameters = CalculationMethod.MoonsightingCommittee()
    parameters.madhab = madhab

    const pt = new PrayerTimes(toAdhanCoords(coords), date, parameters)
    const times: DailyPrayerTimes = {
      fajr: pt.fajr,
      sunrise: pt.sunrise,
      dhuhr: pt.dhuhr,
      asr: pt.asr,
      maghrib: pt.maghrib,
      isha: pt.isha,
    }
    const current = pt.currentPrayer()
    const next = pt.nextPrayer()
    const previous = (() => {
      const order: Prayer[] = [Prayer.Fajr, Prayer.Sunrise, Prayer.Dhuhr, Prayer.Asr, Prayer.Maghrib, Prayer.Isha]
      const idx = current ? order.indexOf(current) : -1
      return idx > 0 ? order[idx - 1] : null
    })()

    const meta: CalculatedPrayerMeta = {
      currentPrayer: current,
      nextPrayer: next,
      previousPrayer: previous,
    }
    return { times, meta }
  }, [coords, madhab])

  return result
}

export const formatPrayerName = (p: Prayer | null) => {
  switch (p) {
    case Prayer.Fajr:
      return 'Fajr'
    case Prayer.Sunrise:
      return 'Sunrise'
    case Prayer.Dhuhr:
      return 'Dhuhr'
    case Prayer.Asr:
      return 'Asr'
    case Prayer.Maghrib:
      return 'Maghrib'
    case Prayer.Isha:
      return 'Isha'
    default:
      return '—'
  }
}


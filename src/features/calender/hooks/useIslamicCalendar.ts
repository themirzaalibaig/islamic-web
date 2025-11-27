import { useState, useMemo } from 'react'
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from 'date-fns'

export const useIslamicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Navigation
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Calendar Grid Generation
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    })
  }, [currentDate])

  // Hijri Formatters with full month names
  const hijriFormatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const hijriMonthFormatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
    month: 'long',
  })

  const hijriDayFormatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
    day: 'numeric',
  })

  const getHijriDate = (d: Date) => {
    try {
      return hijriFormatter.format(d)
    } catch {
      return 'Invalid Date'
    }
  }

  const getHijriMonth = (d: Date) => {
    try {
      return hijriMonthFormatter.format(d)
    } catch {
      return ''
    }
  }

  const getHijriDay = (d: Date) => {
    try {
      return hijriDayFormatter.format(d)
    } catch {
      return ''
    }
  }

  // Events Logic
  const events = [
    { month: 'Ramadan', day: '1', title: 'Start of Ramadan' },
    { month: 'Shawwal', day: '1', title: 'Eid al-Fitr' },
    { month: 'Dhul-Hijjah', day: '10', title: 'Eid al-Adha' },
    { month: 'Muharram', day: '1', title: 'Islamic New Year' },
    { month: 'Muharram', day: '10', title: 'Ashura' },
    { month: 'Rabiʻ I', day: '12', title: 'Mawlid al-Nabi' },
  ]

  const currentHijriMonth = getHijriMonth(selectedDate)
  const currentHijriDay = getHijriDay(selectedDate)

  const todaysEvent = events.find((e) => e.month === currentHijriMonth && e.day === currentHijriDay)

  return {
    currentDate,
    selectedDate,
    calendarDays,
    nextMonth,
    prevMonth,
    goToToday,
    setSelectedDate,
    getHijriDate,
    getHijriMonth,
    getHijriDay,
    todaysEvent,
    events,
    isSameMonth,
    isSameDay,
    isToday,
    format,
  }
}

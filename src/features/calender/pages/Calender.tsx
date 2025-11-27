import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIslamicCalendar } from '../hooks/useIslamicCalendar'

export const Calender = () => {
  const {
    currentDate,
    selectedDate,
    calendarDays,
    nextMonth,
    prevMonth,
    goToToday,
    setSelectedDate,
    getHijriDate,
    todaysEvent,
    events,
    isSameMonth,
    isSameDay,
    isToday,
    format,
  } = useIslamicCalendar()

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Moon className="h-10 w-10" />
            Islamic Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            View Gregorian and Hijri dates with important Islamic events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={goToToday} className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Calendar Section */}
        <Card className="xl:col-span-9 border-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
            <div>
              <CardTitle className="text-2xl font-bold">
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {getHijriDate(currentDate).split(' ').slice(1).join(' ')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth} className="h-10 w-10">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="h-10 w-10">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-3">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-muted-foreground py-3"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isTodayDate = isToday(day)

                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'h-20 lg:h-28 w-full p-3 flex flex-col items-start justify-between border-2 rounded-lg transition-all duration-200 relative group',
                      !isCurrentMonth &&
                        'text-muted-foreground/40 bg-muted/10 border-transparent hover:border-muted',
                      isCurrentMonth &&
                        'bg-card hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20',
                      isSelected && 'ring-2 ring-primary border-primary bg-accent/50 shadow-md',
                      isTodayDate &&
                        !isSelected &&
                        'bg-primary/10 border-primary/50 font-semibold hover:bg-primary/20',
                    )}
                  >
                    <span
                      className={cn(
                        'text-base lg:text-lg font-semibold w-8 h-8 flex items-center justify-center rounded-full transition-colors',
                        isTodayDate && 'bg-primary text-primary-foreground',
                      )}
                    >
                      {format(day, 'd')}
                    </span>

                    {/* Hijri Day Number */}
                    <span
                      className={cn(
                        'text-xs self-end font-medium',
                        isCurrentMonth ? 'text-muted-foreground' : 'text-muted-foreground/30',
                      )}
                    >
                      {getHijriDate(day).split(' ')[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Details Section */}
        <div className="xl:col-span-3 space-y-6">
          {/* Selected Date Card */}
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Moon className="w-40 h-40" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl opacity-90">Selected Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 relative z-10">
              <div>
                <div className="text-sm opacity-80 mb-1">Gregorian</div>
                <div className="text-xl lg:text-2xl font-bold">{format(selectedDate, 'EEEE')}</div>
                <div className="text-lg font-semibold opacity-90">
                  {format(selectedDate, 'MMMM do, yyyy')}
                </div>
              </div>
              <div className="border-t border-primary-foreground/20 pt-4">
                <div className="text-sm opacity-80 mb-1">Hijri</div>
                <div className="text-2xl lg:text-3xl font-bold leading-tight">
                  {getHijriDate(selectedDate)}
                </div>
              </div>

              {todaysEvent && (
                <div className="mt-4 bg-background/20 rounded-lg p-4 backdrop-blur-sm border border-primary-foreground/20">
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <CalendarIcon className="h-4 w-4" />
                    Special Event
                  </div>
                  <div className="text-lg font-medium">{todaysEvent.title}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Important Events
              </CardTitle>
              <CardDescription>Key dates in the Islamic calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {events.map((event, index) => {
                  const selectedHijriMonth = getHijriDate(selectedDate).split(' ')[1]
                  const isThisMonth = selectedHijriMonth?.includes(event.month)

                  return (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-3 border-b last:border-0 pb-3 last:pb-0"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {event.day} {event.month}
                        </div>
                      </div>
                      {isThisMonth && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          This Month
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

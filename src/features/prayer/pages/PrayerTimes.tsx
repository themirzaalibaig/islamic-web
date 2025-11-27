import { useCallback, useMemo } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import {
  useGeolocation,
  useFiqah,
  usePrayerTimes,
  usePrayerClock,
  useWeeklyPrayerTimes,
  formatPrayerName,
} from '@/features/prayer/hooks'
import { formatDurationHms } from '@/features/prayer/utils'
import { format } from 'date-fns'
import { Clock, MapPin, RefreshCcw, Sunrise, Sunset, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export const PrayerTimes = () => {
  const { coords, error: geoError, request } = useGeolocation()
  const { fiqah, loading: fiqLoading } = useFiqah()
  const calculated = usePrayerTimes(coords, fiqah?.madhab || null)
  const clock = usePrayerClock(coords, fiqah?.madhab || null)
  const weekly = useWeeklyPrayerTimes(coords, fiqah?.madhab || null, 7)

  const onRefreshLocation = useCallback(() => {
    request()
  }, [request])

  const items = useMemo(() => {
    const t = calculated?.times
    if (!t) return [] as Array<{ key: keyof typeof t; label: string; time: Date }>
    return [
      { key: 'fajr', label: 'Fajr', time: t.fajr },
      { key: 'sunrise', label: 'Sunrise', time: t.sunrise },
      { key: 'dhuhr', label: 'Dhuhr', time: t.dhuhr },
      { key: 'asr', label: 'Asr', time: t.asr },
      { key: 'maghrib', label: 'Maghrib', time: t.maghrib },
      { key: 'isha', label: 'Isha', time: t.isha },
    ]
  }, [calculated])

  const current = clock.currentPrayer || calculated?.meta.currentPrayer || null
  const next = clock.nextPrayer || calculated?.meta.nextPrayer || null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Prayer Times</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {fiqLoading ? (
              <Skeleton className="h-5 w-24" />
            ) : fiqah ? (
              <Badge variant="outline">{fiqah.name}</Badge>
            ) : (
              <Badge variant="outline">Fiqh not set</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {coords ? (
                <span>
                  {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
                </span>
              ) : (
                <span className="text-destructive">Location unavailable</span>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={onRefreshLocation}>
              <RefreshCcw className="h-4 w-4 mr-2" /> Refresh location
            </Button>
            {geoError ? <span className="text-destructive text-sm">{geoError}</span> : null}
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-sm">Current</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Badge>{formatPrayerName(current)}</Badge>
                    {current === null ? null : current === 'Sunrise' ? (
                      <Sunrise className="h-4 w-4 text-primary" />
                    ) : current === 'Maghrib' ? (
                      <Sunset className="h-4 w-4 text-primary" />
                    ) : current === 'Fajr' || current === 'Isha' ? (
                      <Moon className="h-4 w-4 text-primary" />
                    ) : (
                      <Sun className="h-4 w-4 text-primary" />
                    )}
                    {clock.now ? (
                      <span className="text-sm text-muted-foreground">
                        {format(clock.now, 'p')}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Start</span>
                    <span>{clock.currentStart ? format(clock.currentStart, 'p') : '—'}</span>
                    <span className="text-muted-foreground">End</span>
                    <span>{clock.currentEnd ? format(clock.currentEnd, 'p') : '—'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-sm">Next</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{formatPrayerName(next)}</Badge>
                  {next === null ? null : next === 'Sunrise' ? (
                    <Sunrise className="h-4 w-4 text-primary" />
                  ) : next === 'Maghrib' ? (
                    <Sunset className="h-4 w-4 text-primary" />
                  ) : next === 'Fajr' || next === 'Isha' ? (
                    <Moon className="h-4 w-4 text-primary" />
                  ) : (
                    <Sun className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {clock.nextPrayerTime ? format(clock.nextPrayerTime, 'p') : '—'}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Time left</span>{' '}
                  <span className="font-mono">{formatDurationHms(clock.timeLeftMs || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="today" className="mt-4">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
            <TabsContent value="today">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.length === 0
                  ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20" />)
                  : items.map((it) => {
                      const isCurrent = formatPrayerName(current) === it.label
                      const isNext = formatPrayerName(next) === it.label
                      const icon =
                        it.label === 'Sunrise' ? (
                          <Sunrise className="h-4 w-4 text-muted-foreground" />
                        ) : it.label === 'Maghrib' ? (
                          <Sunset className="h-4 w-4 text-muted-foreground" />
                        ) : it.label === 'Fajr' || it.label === 'Isha' ? (
                          <Moon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Sun className="h-4 w-4 text-muted-foreground" />
                        )
                      return (
                        <Card
                          key={it.key}
                          className={cn(
                            'transition-colors',
                            isCurrent || isNext ? 'border-primary bg-primary/5' : 'border-border',
                          )}
                        >
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">{it.label}</CardTitle>
                            {icon}
                          </CardHeader>
                          <CardContent className="flex items-center justify-between">
                            <div className="text-2xl font-mono">{format(it.time, 'p')}</div>
                            {isCurrent && <Badge className="ml-2">Current</Badge>}
                            {isNext && (
                              <Badge variant="secondary" className="ml-2">
                                Next
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
              </div>
            </TabsContent>
            <TabsContent value="week">
              {!weekly ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Fajr</TableHead>
                      <TableHead>Sunrise</TableHead>
                      <TableHead>Dhuhr</TableHead>
                      <TableHead>Asr</TableHead>
                      <TableHead>Maghrib</TableHead>
                      <TableHead>Isha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weekly.map((d) => {
                      const isToday =
                        format(new Date(), 'yyyy-MM-dd') === format(d.date, 'yyyy-MM-dd')
                      return (
                        <TableRow
                          key={d.date.toISOString()}
                          className={cn(isToday ? 'bg-primary/5' : '')}
                        >
                          <TableCell className="font-medium">
                            {format(d.date, 'EEE dd MMM')}
                          </TableCell>
                          <TableCell className="font-mono">{format(d.fajr, 'p')}</TableCell>
                          <TableCell className="font-mono">{format(d.sunrise, 'p')}</TableCell>
                          <TableCell className="font-mono">{format(d.dhuhr, 'p')}</TableCell>
                          <TableCell className="font-mono">{format(d.asr, 'p')}</TableCell>
                          <TableCell className="font-mono">{format(d.maghrib, 'p')}</TableCell>
                          <TableCell className="font-mono">{format(d.isha, 'p')}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

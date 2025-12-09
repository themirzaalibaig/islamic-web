import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
  Skeleton,
} from '@/components/ui'
import { useAuth } from '@/features/auth'
import {
  usePrayerTimes,
  usePrayerClock,
  useGeolocation,
  useFiqah,
  formatPrayerName,
} from '@/features/prayer'
import { RandomHadithCard } from '@/features/hadith'
import { useDuas } from '@/features/dua'
import { SIDEBAR_MENU } from '@/constants/sidebar'
import {
  Clock,
  BookOpen,
  Heart,
  Target,
  HomeIcon,
  ArrowRight,
  MapPin,
  Sparkles,
  ChevronRight,
  Sunrise,
  Sun,
  Moon,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { coords } = useGeolocation()
  const { fiqah } = useFiqah()
  const calculated = usePrayerTimes(coords, fiqah?.madhab || null)
  const clock = usePrayerClock(coords, fiqah?.madhab || null)
  const { duas } = useDuas()

  // Get a featured dua - use first one for stability
  const featuredDua = useMemo(() => {
    if (duas.length === 0) return null
    // Use the first dua for consistency (or could use a hash of date for daily rotation)
    return duas[0]
  }, [duas])

  // Filter out home from menu items
  const featureItems = useMemo(
    () => SIDEBAR_MENU.filter((item) => item.href !== '/'),
    [],
  )

  // Get current and next prayer info
  const currentPrayer = clock.currentPrayer || calculated?.meta.currentPrayer || null
  const nextPrayer = clock.nextPrayer || calculated?.meta.nextPrayer || null

  // Prayer times for today
  const todayPrayers = useMemo(() => {
    if (!calculated?.times) return []
    const times = calculated.times
    return [
      { name: 'Fajr', time: times.fajr, icon: <Sunrise /> },
      { name: 'Sunrise', time: times.sunrise, icon: <Sun /> },
      { name: 'Dhuhr', time: times.dhuhr, icon: <Sun /> },
      { name: 'Asr', time: times.asr, icon: <Moon /> },
      { name: 'Maghrib', time: times.maghrib, icon: <Moon /> },
      { name: 'Isha', time: times.isha, icon: <Moon /> },
    ]
  }, [calculated])

  // Get greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }, [])

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-primary/20 bg-linear-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl">
                {greeting}, {user?.username || user?.email?.split('@')[0] || 'Guest'}! 👋
              </CardTitle>
              <CardDescription className="text-base">
                Welcome to your Islamic companion. Explore Quran, Hadith, Duas, and more.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {fiqah && (
                <Badge variant="secondary" className="text-sm px-3 py-1.5">
                  {fiqah.name} Fiqh
                </Badge>
              )}
              {coords && (
                <Badge variant="outline" className="text-sm px-3 py-1.5">
                  <MapPin className="h-3 w-3 mr-1" />
                  Location Set
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Access Features Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5 text-primary" />
            Quick Access
          </CardTitle>
          <CardDescription>Access all features with one click</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featureItems.map((item) => {
              const Icon = item.icon || HomeIcon
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    'group relative flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2',
                    'bg-card hover:bg-primary/5 hover:border-primary transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  )}
                >
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-center">{item.title}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2" />
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prayer Times Card - Takes 2 columns on large screens */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Today's Prayer Times
                </CardTitle>
                <CardDescription className="mt-1">
                  {coords ? (
                    <span className="text-sm">
                      Current Location ({coords.latitude.toFixed(2)}, {coords.longitude.toFixed(2)})
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Enable location to see prayer times
                    </span>
                  )}
                </CardDescription>
              </div>
              {nextPrayer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/prayer-times')}
                >
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!coords ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Location access is needed to calculate prayer times
                </p>
                <Button variant="outline" onClick={() => navigate('/prayer-times')}>
                  Set Location
                </Button>
              </div>
            ) : calculated?.times ? (
              <div className="space-y-4">
                {/* Current Prayer Highlight */}
                {currentPrayer && (
                  <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Currently</p>
                        <p className="text-lg font-semibold text-primary">
                          {formatPrayerName(currentPrayer)} Prayer
                        </p>
                        {clock.currentStart && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Started at {format(clock.currentStart, 'h:mm a')}
                          </p>
                        )}
                      </div>
                      <Clock className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                )}

                {/* Next Prayer */}
                {nextPrayer && clock.nextPrayerTime && (
                  <div className="p-4 rounded-lg bg-accent border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Next Prayer</p>
                        <p className="text-lg font-semibold">{formatPrayerName(nextPrayer)}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(clock.nextPrayerTime, 'h:mm a')}
                          {clock.timeLeftMs > 0 && (
                            <span className="ml-2 text-xs">
                              (in {Math.floor(clock.timeLeftMs / (1000 * 60 * 60))}h{' '}
                              {Math.floor((clock.timeLeftMs % (1000 * 60 * 60)) / (1000 * 60))}m)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* All Prayer Times Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {todayPrayers.map((prayer) => {
                    const currentName =
                      typeof currentPrayer === 'string'
                        ? currentPrayer
                        : currentPrayer?.name || ''
                    const nextName =
                      typeof nextPrayer === 'string' ? nextPrayer : nextPrayer?.name || ''
                    const isCurrent = currentName.toLowerCase() === prayer.name.toLowerCase()
                    const isNext = nextName.toLowerCase() === prayer.name.toLowerCase()
                    return (
                      <div
                        key={prayer.name}
                        className={cn(
                          'p-3 rounded-lg border text-center transition-colors',
                          isCurrent && 'bg-primary/10 border-primary/30',
                          isNext && !isCurrent && 'bg-accent border-primary/20',
                          !isCurrent && !isNext && 'bg-card',
                        )}
                      >
                        <div className="text-2xl mb-1 text-primary text-center">{prayer.icon}</div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          {prayer.name}
                        </p>
                        <p className="text-sm font-semibold">{format(prayer.time, 'h:mm a')}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Dua Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Featured Dua
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dua')}
                className="text-xs"
              >
                View All
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {featuredDua ? (
              <div className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {featuredDua.category}
                  </Badge>
                  <h4 className="font-semibold text-lg mb-2">{featuredDua.title}</h4>
                </div>

                {/* Arabic Text */}
                <div
                  className="text-xl font-arabic text-right leading-relaxed text-primary/90"
                  dir="rtl"
                  lang="ar"
                >
                  {featuredDua.arabic}
                </div>

                {/* Transliteration */}
                {featuredDua.transliteration && (
                  <div className="text-sm text-muted-foreground italic">
                    {featuredDua.transliteration}
                  </div>
                )}

                {/* Translation */}
                <div className="text-sm leading-relaxed line-clamp-3">
                  {featuredDua.translation}
                </div>

                {featuredDua.reference && (
                  <p className="text-xs text-muted-foreground">Reference: {featuredDua.reference}</p>
                )}

                <Separator />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/dua/${featuredDua._id}`)}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Read Full Dua
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Random Hadith Section */}
      <RandomHadithCard />

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              About This App
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your comprehensive Islamic companion providing authentic resources including the Holy
              Quran with audio recitation, authentic Hadith collections, daily duas and
              supplications, accurate prayer times, Qibla direction finder, and more.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">Quran</Badge>
              <Badge variant="secondary">Hadith</Badge>
              <Badge variant="secondary">Duas</Badge>
              <Badge variant="secondary">Prayer Times</Badge>
              <Badge variant="secondary">Qibla</Badge>
              <Badge variant="secondary">Calendar</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <p className="text-muted-foreground">
                  Enable location access for accurate prayer time calculations
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <p className="text-muted-foreground">
                  Set your preferred Fiqh (Madhab) in your profile for personalized prayer times
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <p className="text-muted-foreground">
                  Explore daily duas and supplications to enhance your spiritual practice
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

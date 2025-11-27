import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Compass as CompassIcon,
  AlertCircle,
  MapPin,
  RotateCcw,
  Loader2,
  ArrowUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGeolocation } from '@/features/prayer'
import { useQibla } from '../'

export const Qibla = () => {
  const { coords, status, error: geoError, request: requestLocation } = useGeolocation()
  const {
    heading,
    qiblaBearing,
    error: compassError,
    permissionGranted,
    isIOS,
    requestAccess,
  } = useQibla(coords?.latitude, coords?.longitude)

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  // Calculate rotation for the Qibla arrow
  const arrowRotation = qiblaBearing !== null ? qiblaBearing - heading : 0
  const compassRotation = -heading
  const isAligned =
    qiblaBearing !== null && Math.abs(((heading - qiblaBearing + 540) % 360) - 180) < 5

  useEffect(() => {
    if (isAligned && navigator.vibrate) {
      navigator.vibrate(50)
    }
  }, [isAligned])

  const loading = status === 'idle' || status === 'prompt'
  const error = geoError || compassError

  return (
    <div className="container mx-auto p-4 max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Qibla Finder</h1>
        <p className="text-muted-foreground">Align yourself towards the Kaaba</p>
      </div>

      {loading ? (
        <Card className="w-full h-96 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Acquiring location...</p>
          </div>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Alert>
      ) : (
        <div className="space-y-6">
          {!permissionGranted && isIOS && (
            <Alert>
              <CompassIcon className="h-4 w-4" />
              <AlertTitle>Calibration Needed</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <p>We need access to your device's compass to show the direction.</p>
                <Button onClick={requestAccess} className="w-full">
                  Enable Compass
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Card className="relative overflow-hidden border-2 shadow-lg bg-gradient-to-b from-background to-muted/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <MapPin className="h-5 w-5 text-primary" />
                {qiblaBearing?.toFixed(0)}°{' '}
                <span className="text-muted-foreground text-sm font-normal">to Qibla</span>
              </CardTitle>
              <CardDescription>Current Heading: {heading.toFixed(0)}°</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              {/* Compass Container */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer Ring / Dial - Rotates with Compass */}
                <div
                  className="absolute inset-0 rounded-full border-4 border-muted transition-transform duration-300 ease-out shadow-inner bg-card"
                  style={{ transform: `rotate(${compassRotation}deg)` }}
                >
                  {/* Cardinal Points */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-primary">
                    N
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-muted-foreground">
                    S
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                    E
                  </div>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                    W
                  </div>

                  {/* Degree Ticks (Simplified) */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <div
                      key={deg}
                      className="absolute top-0 left-1/2 w-0.5 h-3 bg-border origin-bottom"
                      style={{
                        transform: `translateX(-50%) rotate(${deg}deg)`,
                        transformOrigin: '50% 128px', // Half of w-64 (256px) = 128px
                      }}
                    />
                  ))}

                  {/* Qibla Marker on the Dial */}
                  {qiblaBearing !== null && (
                    <div
                      className="absolute top-0 left-1/2 w-1 h-1/2 origin-bottom flex flex-col items-center justify-start pt-8"
                      style={{
                        transform: `translateX(-50%) rotate(${qiblaBearing}deg)`,
                        transformOrigin: '50% 128px',
                      }}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse absolute -top-1 -left-1" />
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md z-10">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        {/* Kaaba Icon / Label */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-primary bg-background/80 px-1 rounded">
                          Kaaba
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Center Static Elements (Phone Direction) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Crosshair */}
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-background z-20" />

                  {/* Direction Line (Fixed Upwards) - Represents Phone Heading */}
                  <div className="absolute top-0 w-1 h-8 bg-destructive/80 rounded-full z-20" />
                </div>

                {/* Dynamic Qibla Pointer (Arrow that points to Qibla relative to phone) */}
                <div
                  className={cn(
                    'absolute w-40 h-40 flex items-center justify-center transition-transform duration-500 ease-out z-10',
                    isAligned ? 'scale-110' : 'opacity-50',
                  )}
                  style={{ transform: `rotate(${arrowRotation}deg)` }}
                >
                  <ArrowUp
                    className={cn(
                      'w-16 h-16 drop-shadow-lg transition-colors duration-300',
                      isAligned
                        ? 'text-green-500 fill-green-500'
                        : 'text-primary/40 fill-primary/20',
                    )}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">
                  Latitude
                </span>
                <span className="font-mono font-medium">{coords?.latitude.toFixed(4)}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">
                  Longitude
                </span>
                <span className="font-mono font-medium">{coords?.longitude.toFixed(4)}</span>
              </CardContent>
            </Card>
          </div>

          <Alert className="bg-muted/50">
            <RotateCcw className="h-4 w-4" />
            <AlertTitle>Calibration</AlertTitle>
            <AlertDescription>
              If the compass seems inaccurate, try moving your device in a figure-8 motion.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}

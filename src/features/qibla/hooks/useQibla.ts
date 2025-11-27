import { useState, useEffect, useCallback, useMemo } from 'react'

// Types for DeviceOrientation with iOS support
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  webkitCompassHeading?: number
  requestPermission?: () => Promise<'granted' | 'denied'>
}

// Extend Window interface for deviceorientationabsolute
declare global {
  interface Window {
    ondeviceorientationabsolute: ((this: Window, ev: DeviceOrientationEvent) => any) | null
  }
  interface WindowEventMap {
    deviceorientationabsolute: DeviceOrientationEvent
  }
}

const KAABA_COORDS = {
  latitude: 21.422487,
  longitude: 39.826206,
}

export const useQibla = (latitude: number | undefined, longitude: number | undefined) => {
  const [heading, setHeading] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const isIOSDevice = typeof (DeviceOrientationEvent as any)?.requestPermission === 'function'
    return !isIOSDevice
  })

  const [isIOS] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return typeof (DeviceOrientationEvent as any)?.requestPermission === 'function'
  })

  // Calculate Qibla direction based on user location
  const calculateQibla = useCallback((lat: number, long: number) => {
    const PI = Math.PI
    const lat1 = lat * (PI / 180)
    const long1 = long * (PI / 180)
    const lat2 = KAABA_COORDS.latitude * (PI / 180)
    const long2 = KAABA_COORDS.longitude * (PI / 180)

    const y = Math.sin(long2 - long1)
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(long2 - long1)

    let qibla = Math.atan2(y, x) * (180 / PI)
    qibla = (qibla + 360) % 360
    return qibla
  }, [])

  const qiblaBearing = useMemo(() => {
    if (latitude && longitude) {
      return calculateQibla(latitude, longitude)
    }
    return null
  }, [latitude, longitude, calculateQibla])

  // Handle Device Orientation
  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent | DeviceOrientationEventiOS) => {
      let compass = 0

      if ((event as DeviceOrientationEventiOS).webkitCompassHeading) {
        // iOS
        compass = (event as DeviceOrientationEventiOS).webkitCompassHeading!
      } else if (event.alpha) {
        // Android / Non-iOS
        compass = Math.abs(event.alpha - 360)
      }

      setHeading(compass)
    },
    [],
  )

  useEffect(() => {
    if (!isIOS) {
      // Android/Desktop - try absolute first
      if ('ondeviceorientationabsolute' in window) {
        ;(window as any).addEventListener('deviceorientationabsolute', handleOrientation)
      } else {
        ;(window as Window).addEventListener('deviceorientation', handleOrientation)
      }
    }

    return () => {
      ;(window as any).removeEventListener('deviceorientationabsolute', handleOrientation)
      ;(window as Window).removeEventListener('deviceorientation', handleOrientation)
    }
  }, [handleOrientation, isIOS])

  const requestAccess = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === 'granted') {
          setPermissionGranted(true)
          ;(window as Window).addEventListener('deviceorientation', handleOrientation)
        } else {
          setError('Permission to access device orientation was denied')
        }
      } catch (e) {
        console.error(e)
        setError('Error requesting device orientation permission')
      }
    }
  }

  return {
    heading,
    qiblaBearing,
    error,
    permissionGranted,
    isIOS,
    requestAccess,
  }
}

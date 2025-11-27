import { useCallback, useEffect, useMemo, useState } from 'react'

type GeolocationStatus = 'idle' | 'prompt' | 'granted' | 'denied' | 'error'

export type Coordinates = {
  latitude: number
  longitude: number
}

export const useGeolocation = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null)
  const [status, setStatus] = useState<GeolocationStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('error')
      setError('Geolocation is not supported in this browser')
      return
    }
    setStatus('prompt')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setStatus('granted')
        setError(null)
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error')
        setError(err.message || 'Unable to fetch location')
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 },
    )
  }, [])

  useEffect(() => {
    const init = () => request()
    const t = setTimeout(init, 0)
    return () => clearTimeout(t)
  }, [request])

  const value = useMemo(
    () => ({ coords, status, error, request }),
    [coords, status, error, request],
  )

  return value
}


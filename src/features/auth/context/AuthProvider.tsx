import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/config'

type AuthContextValue = {
  session: Session | null
  isAuthenticated: boolean
  loading: boolean
  rememberMe: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<{ error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ error?: string; requiresVerification?: boolean }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  resendVerification: (email: string) => Promise<{ error?: string }>
}

export const AuthContext = createContext<AuthContextValue>({
  session: null,
  isAuthenticated: false,
  loading: true,
  rememberMe: true,
  login: async () => ({}),
  signup: async () => ({}),
  logout: async () => {},
  resetPassword: async () => ({}),
  resendVerification: async () => ({}),
})

const AUTH_ATTEMPTS_KEY = 'auth:attempts'
const AUTH_REMEMBER_KEY = 'auth:remember'
const CSRF_COOKIE = 'csrfToken'

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : ''
}

const setCookie = (name: string, value: string, days = 30) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`
}

const ensureCsrfCookie = () => {
  let token = getCookie(CSRF_COOKIE)
  if (!token) {
    token = crypto.randomUUID()
    setCookie(CSRF_COOKIE, token)
  }
  return token
}

const now = () => Date.now()

const recordAttempt = () => {
  const raw = localStorage.getItem(AUTH_ATTEMPTS_KEY)
  const list: number[] = raw ? JSON.parse(raw) : []
  const updated = list.filter((t) => now() - t < 60_000)
  updated.push(now())
  localStorage.setItem(AUTH_ATTEMPTS_KEY, JSON.stringify(updated))
  return updated.length
}

const tooManyAttempts = () => {
  const raw = localStorage.getItem(AUTH_ATTEMPTS_KEY)
  const list: number[] = raw ? JSON.parse(raw) : []
  const recent = list.filter((t) => now() - t < 60_000)
  return recent.length >= 5
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [rememberMe, setRememberMe] = useState<boolean>(() => (localStorage.getItem(AUTH_REMEMBER_KEY) ?? 'true') === 'true')
  const idleTimeoutMs = 30 * 60 * 1000
  const lastActivityRef = useRef<number>(now())

  useEffect(() => {
    ensureCsrfCookie()
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session ?? null)
      setLoading(false)
    }
    init()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const updateActivity = () => (lastActivityRef.current = now())
    const events = ['mousemove', 'keydown', 'scroll', 'click']
    events.forEach((e) => window.addEventListener(e, updateActivity))
    const timer = setInterval(() => {
      if (!rememberMe && session) {
        if (now() - lastActivityRef.current > idleTimeoutMs) void supabase.auth.signOut()
      }
    }, 15_000)
    return () => {
      clearInterval(timer)
      events.forEach((e) => window.removeEventListener(e, updateActivity))
    }
  }, [rememberMe, session])

  useEffect(() => {
    const handler = () => {
      if (!rememberMe) void supabase.auth.signOut()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [rememberMe])

  const login = useCallback(async (email: string, password: string, remember = true) => {
    if (tooManyAttempts()) return { error: 'Too many attempts. Please wait and try again.' }
    recordAttempt()
    setRememberMe(!!remember)
    localStorage.setItem(AUTH_REMEMBER_KEY, remember ? 'true' : 'false')
    const csrfToken = getCookie(CSRF_COOKIE)
    if (!csrfToken) return { error: 'CSRF token missing' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    if (tooManyAttempts()) return { error: 'Too many attempts. Please wait and try again.' }
    recordAttempt()
    const csrfToken = getCookie(CSRF_COOKIE)
    if (!csrfToken) return { error: 'CSRF token missing' }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin + '/login',
      },
    })
    return { error: error?.message, requiresVerification: !!data.user && !data.user.email_confirmed_at }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    })
    return { error: error?.message }
  }, [])

  const resendVerification = useCallback(async (email: string) => {
    // Supabase will send a new confirmation email by re-calling signUp
    const { error } = await supabase.auth.signUp({ email, password: crypto.randomUUID() })
    return { error: error?.message }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isAuthenticated: !!session,
    loading,
    rememberMe,
    login,
    signup,
    logout,
    resetPassword,
    resendVerification,
  }), [session, loading, rememberMe, login, signup, logout, resetPassword, resendVerification])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


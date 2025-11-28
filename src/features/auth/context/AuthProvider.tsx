import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/config'
import { useLocalStorage } from '@reactuses/core'

type AuthContextValue = {
  session: Session | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<{ error?: string }>
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ error?: string; requiresVerification?: boolean }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  resendVerification: (email: string) => Promise<{ error?: string }>
}
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useLocalStorage<Session | null>('session', null, {
    serializer: {
      read: (value: string) => JSON.parse(value),
      write: (value: Session | null) => JSON.stringify(value),
    },
  })

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session ?? null)
      setLoading(false)
    }
    void init()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [setSession])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin + '/login',
      },
    })
    return {
      error: error?.message,
      requiresVerification: !!data.user && !data.user.email_confirmed_at,
    }
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

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: !!session,
      loading,
      login,
      signup,
      logout,
      resetPassword,
      resendVerification,
    }),
    [session, loading, login, signup, logout, resetPassword, resendVerification],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue>({
  session: null,
  isAuthenticated: false,
  loading: true,
  login: async () => ({}),
  signup: async () => ({}),
  logout: async () => {},
  resetPassword: async () => ({}),
  resendVerification: async () => ({}),
})

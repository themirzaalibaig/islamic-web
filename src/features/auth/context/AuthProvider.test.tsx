import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { AuthProvider } from './AuthProvider'
import * as config from '../../../config/supabase'

describe('AuthProvider', () => {
  it('signs out on beforeunload when rememberMe is false', async () => {
    const signOut = vi.fn(async () => ({ error: null }))
    vi.spyOn(config, 'supabase', 'get').mockReturnValue({ auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), signOut } } as any)
    localStorage.setItem('auth:remember', 'false')
    render(<AuthProvider><div /></AuthProvider>)
    window.dispatchEvent(new Event('beforeunload'))
    expect(signOut).toHaveBeenCalled()
  })
})

import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Signup } from './Signup'
import { AuthContext } from '../context/AuthProvider'

describe('Signup Page', () => {
  it('validates password strength and terms', async () => {
    const user = userEvent.setup()
    const signup = async () => ({ error: undefined, requiresVerification: true })
    render(
      <AuthContext.Provider value={{ session: null, isAuthenticated: false, loading: false, rememberMe: true, login: async () => ({}), signup: signup as any, logout: async () => {}, resetPassword: async () => ({}), resendVerification: async () => ({}) }}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </AuthContext.Provider>
    )

    await user.type(screen.getByLabelText(/name/i), 'U')
    await user.type(screen.getByLabelText(/^email/i), 'bad')
    await user.type(screen.getByLabelText(/^password/i), 'weak')
    await user.type(screen.getByLabelText(/confirm password/i), 'weak2')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/^email/i))
    await user.type(screen.getByLabelText(/^email/i), 'u@example.com')
    await user.clear(screen.getByLabelText(/name/i))
    await user.type(screen.getByLabelText(/name/i), 'User')
    await user.clear(screen.getByLabelText(/^password/i))
    await user.type(screen.getByLabelText(/^password/i), 'Aa1!abcd')
    await user.clear(screen.getByLabelText(/confirm password/i))
    await user.type(screen.getByLabelText(/confirm password/i), 'Aa1!abcd')
    await user.click(screen.getByLabelText(/i agree/i))
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(await screen.findByText(/account created/i)).toBeInTheDocument()
  })
})

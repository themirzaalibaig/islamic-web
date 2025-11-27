import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Login } from './Login'
import { AuthContext } from '../context/AuthProvider'

describe('Login Page', () => {
  it('validates inputs and shows errors', async () => {
    const user = userEvent.setup()
    const login = async () => ({ error: 'Invalid credentials' })
    render(
      <AuthContext.Provider value={{ session: null, isAuthenticated: false, loading: false, rememberMe: true, login: login as any, signup: async () => ({}), logout: async () => {}, resetPassword: async () => ({}), resendVerification: async () => ({}) }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    )

    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.type(screen.getByLabelText(/password/i), 'x')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/email/i))
    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  })
})

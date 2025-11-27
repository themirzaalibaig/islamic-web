import { describe, expect, it } from 'vitest'
import { loginSchema, signupSchema, passwordSchema, forgotPasswordSchema } from './auth'

describe('Auth Schemas', () => {
  it('validates strong passwords', () => {
    const res = passwordSchema.safeParse('Aa1!abcd')
    expect(res.success).toBe(true)
  })

  it('rejects weak passwords', () => {
    const res = passwordSchema.safeParse('password')
    expect(res.success).toBe(false)
  })

  it('login requires email and password', () => {
    const res = loginSchema.safeParse({ email: 'user@example.com', password: 'x' })
    expect(res.success).toBe(true)
  })

  it('signup requires matching passwords and terms', () => {
    const ok = signupSchema.safeParse({
      name: 'User',
      email: 'u@example.com',
      password: 'Aa1!abcd',
      confirmPassword: 'Aa1!abcd',
      terms: true,
    })
    expect(ok.success).toBe(true)

    const bad = signupSchema.safeParse({
      name: 'User',
      email: 'u@example.com',
      password: 'Aa1!abcd',
      confirmPassword: 'Aa1!abce',
      terms: false,
    })
    expect(bad.success).toBe(false)
  })

  it('forgot password requires valid email', () => {
    const res = forgotPasswordSchema.safeParse({ email: 'u@example.com' })
    expect(res.success).toBe(true)
  })
})


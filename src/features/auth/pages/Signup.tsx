import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { signupSchema, type SignupInput } from '@/schemas'
import { useAuth } from '@/features/auth'

export const Signup = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const methods = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
    mode: 'onChange',
  })

  const onSubmit = async (values: SignupInput) => {
    setLoading(true)
    setError('')
    setSuccess('')
    const { error, requiresVerification } = await signup(values.name, values.email, values.password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    if (requiresVerification) {
      setSuccess('Account created. Please check your email to verify before logging in.')
      return
    }
    navigate('/login')
  }

  return (
    <AuthLayout>
      <Form {...methods}>
        <form className="grid gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-semibold">Sign Up</h1>
          {error && <div className="text-destructive text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <input id="terms" type="checkbox" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  <FormLabel htmlFor="terms">I agree to the terms and conditions</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>
          <div className="flex justify-between text-sm">
            <Link to="/login" className="text-primary">Already have an account?</Link>
            <Link to="/forgot-password" className="text-primary">Forgot Password</Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  )
}


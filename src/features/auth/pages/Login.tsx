import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { loginSchema, type LoginInput } from '@/schemas'
import { useAuth } from '@/features/auth'

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: { email: '', password: '', remember: true },
    mode: 'onChange',
  })

  const onSubmit = async (values: LoginInput) => {
    setLoading(true)
    setError('')
    const { error } = await login(values.email, values.password, values.remember)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    navigate('/')
  }

  return (
    <AuthLayout>
      <Form {...methods}>
        <form className="grid gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-semibold">Login</h1>
          {error && <div className="text-destructive text-sm">{error}</div>}
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
            name="remember"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  <FormLabel htmlFor="remember">Remember me</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="text-primary">Forgot Password?</Link>
            <Link to="/signup" className="text-primary">Sign Up</Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  )
}


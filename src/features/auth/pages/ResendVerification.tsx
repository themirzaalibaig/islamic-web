import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/schemas'
import { useAuth } from '@/features/auth'

export const ResendVerification = () => {
  const { resendVerification } = useAuth()
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const methods = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  const onSubmit = async (values: ForgotPasswordInput) => {
    setLoading(true)
    setError('')
    setSuccess('')
    const { error } = await resendVerification(values.email)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setSuccess('Verification email resent. Please check your inbox.')
  }

  return (
    <AuthLayout>
      <Form {...methods}>
        <form className="grid gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-semibold">Resend Verification</h1>
          {error && <div className="text-destructive text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Resending…' : 'Resend Email'}
          </Button>
          <div className="flex justify-between text-sm">
            <Link to="/login" className="text-primary">Back to Login</Link>
            <Link to="/signup" className="text-primary">Create Account</Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  )
}


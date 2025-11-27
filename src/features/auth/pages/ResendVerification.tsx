import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from '@/components/ui'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/schemas'
import { useAuth } from '@/features/auth'
import { toast } from 'react-toastify'

export const ResendVerification = () => {
  const { resendVerification } = useAuth()

  const methods = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  const onSubmit = async (values: ForgotPasswordInput) => {
    const { error } = await resendVerification(values.email)
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Verification email resent. Please check your inbox.')
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  return (
    <AuthLayout>
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Resend verification email</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a new verification link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...methods}>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Resending…' : 'Resend Email'}
              </Button>
              <div className="text-center text-sm">
                <Link
                  to="/login"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Back to Login
                </Link>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

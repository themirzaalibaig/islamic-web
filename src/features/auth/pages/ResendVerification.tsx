import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Shield } from 'lucide-react'
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
import { otpSchema, type OtpSchema } from '@/features/auth'
import { useAuth } from '@/features/auth'
import { toast } from 'react-toastify'
import { useAppSelector } from '@/redux'

export const ResendVerification = () => {
  const { verifyEmail, resendVerificationEmail } = useAuth()
  const { verificationEmail } = useAppSelector((store) => store.auth)

  const methods = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
    mode: 'onChange',
  })

  const onSubmit = async (values: OtpSchema) => {
    try {
      await verifyEmail(values, methods.setError)
    } catch (error) {
      console.error(error)
    }
  }

  const handleResend = async () => {
    if (!verificationEmail) {
      toast.error('No email found. Please sign up again.')
      return
    }
    const result = await resendVerificationEmail({ email: verificationEmail }, methods.setError)
    if (result?.success) {
      toast.success('Verification email resent. Please check your inbox.')
    }
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
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Verify Your Email
          </CardTitle>
          <CardDescription>
            {verificationEmail ? (
              <>
                We've sent a verification code to <strong>{verificationEmail}</strong>. Please enter
                the code below.
              </>
            ) : (
              'Please enter the verification code sent to your email address.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...methods}>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Enter 6-digit code"
                          className="pl-10 text-center text-lg tracking-widest"
                          maxLength={6}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                            field.onChange(value)
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify Email'}
              </Button>
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={!verificationEmail || isSubmitting}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Code
                </Button>
              </div>
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

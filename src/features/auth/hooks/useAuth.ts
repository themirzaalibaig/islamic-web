import {
  login as loginAction,
  logout as logoutAction,
  refreshToken as refreshTokenAction,
  setVerificationEmail,
  setForgotPasswordEmail,
  useAppDispatch,
  useAppSelector,
} from '@/redux'
import type {
  EmailSchema,
  LoginSchema,
  OtpSchema,
  ResetPasswordSchema,
  SignupSchema,
} from '@/features/auth'
import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants'
import { useNavigate } from 'react-router-dom'
import type { UseFormSetError } from 'react-hook-form'
import { handleValidationErrors } from '@/lib'
import type { User } from '@/types/user'
import axios from 'axios'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { forgotPasswordEmail, verificationEmail, isAuthenticated, user, token } = useAppSelector(
    (store) => store.auth,
  )
  const nevigate = useNavigate()
  const api = useApi([''], '', {
    auth: false,
    enabled: false,
  })

  const signup = async (payload: SignupSchema, setError: UseFormSetError<any>) => {
    try {
      const response = await api.post<{ success: boolean }>(payload, {
        url: ENDPOINTS.AUTH.SIGNUP(),
      })
      if (response.data.success) {
        dispatch(setVerificationEmail(payload.email))
        nevigate('/verify-email')
      } else {
        console.log(response)
      }
    } catch (error) {
      handleValidationErrors(error, setError, { fields: ['username', 'email', 'password'] })
    }
  }
  const login = async (payload: LoginSchema, setError: UseFormSetError<any>) => {
    try {
      const { data } = await api.post<{
        success: boolean
        message: string
        data: {
          user: User
          token: {
            accessToken: string
            refreshToken: string
          }
        }
      }>(payload, {
        url: ENDPOINTS.AUTH.LOGIN(),
      })
      console.log(data)
      if (data.success) {
        console.log('login success');
        
        dispatch(loginAction({ user: data.data.user, token: data.data.token }))
        nevigate('/')
      } else {
        console.log(data)
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data.message === 'User not verified') {
        await resendVerificationEmail({ email: payload.email }, setError)
        dispatch(setVerificationEmail(payload.email))
        nevigate('/verify-email')
      } else {
        handleValidationErrors(error, setError, {
          fields: ['email', 'password'],
        })
      }
    }
  }
  const logout = async () => {
    try {
      const response = await api.get<{ success: boolean }>({
        url: ENDPOINTS.AUTH.LOGOUT(),
      })
      if (response.data.success) {
        dispatch(logoutAction())
        nevigate('/login')
      } else {
        console.log(response)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const verifyEmail = async (payload: OtpSchema, setError: UseFormSetError<any>) => {
    try {
      const payloadWithEmail = { ...payload, email: verificationEmail }
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          user: User
          token: {
            accessToken: string
            refreshToken: string
          }
        }
      }>(payloadWithEmail, {
        url: ENDPOINTS.AUTH.VERIFY_EMAIL(),
      })
      if (response.data.success) {
        dispatch(loginAction({ user: response.data.data.user, token: response.data.data.token }))
        nevigate('/')
      } else {
        console.log(response)
      }
    } catch (error) {
      handleValidationErrors(error, setError, {
        fields: ['otp'],
      })
    }
  }

  const resendVerificationEmail = async (payload: EmailSchema, setError: UseFormSetError<any>) => {
    try {
      const response = await api.post<{ success: boolean }>(payload, {
        url: ENDPOINTS.AUTH.RESEND_VERIFICATION_EMAIL(),
        silent: true,
      })
      return { success: response.data.success }
    } catch (error) {
      handleValidationErrors(error, setError, {
        fields: ['email'],
      })
      return { success: false }
    }
  }

  const forgotPassword = async (payload: EmailSchema, setError: UseFormSetError<any>) => {
    try {
      const response = await api.post<{ success: boolean }>(payload, {
        url: ENDPOINTS.AUTH.FORGOT_PASSWORD(),
      })
      if (response.data.success) {
        dispatch(setForgotPasswordEmail(payload.email))
        nevigate('/reset-password')
      } else {
        console.log(response)
      }
    } catch (error) {
      handleValidationErrors(error, setError, {
        fields: ['email'],
      })
    }
  }

  const resetPassword = async (payload: ResetPasswordSchema, setError: UseFormSetError<any>) => {
    try {
      const payloadWithEmail = { ...payload, email: forgotPasswordEmail }
      const response = await api.post<{ success: boolean }>(payloadWithEmail, {
        url: ENDPOINTS.AUTH.RESET_PASSWORD(),
      })
      if (response.data.success) {
        nevigate('/login')
      } else {
        console.log(response)
      }
    } catch (error) {
      handleValidationErrors(error, setError, {
        fields: ['otp', 'password'],
      })
    }
  }

  const refreashToken = async (payload: { refreshToken: string }) => {
    try {
      const { data } = await api.post<{
        success: boolean
        message: string
        data: {
          user: User
          token: {
            accessToken: string
            refreshToken: string
          }
        }
      }>(payload, {
        url: ENDPOINTS.AUTH.REFRESH_TOKEN(),
      })
      if (data.success) {
        dispatch(refreshTokenAction({
          accessToken: data.data.token.accessToken,
          refreshToken: data.data.token.refreshToken,
        }))
      } else {
        console.log(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    isAuthenticated,
    user,
    token,
    signup,
    login,
    logout,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    refreashToken,
  }
}

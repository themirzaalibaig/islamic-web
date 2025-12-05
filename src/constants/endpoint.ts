import { createResourceEndpoints, createCustomEndpoints } from '@/lib'
import type { Pagination, Sort, Status } from '@/types'

type TestParams = Pagination & Sort & Status

export const ENDPOINTS = {
  TESTS: {
    ...createResourceEndpoints<TestParams, string | number>('/tests'),
    ...createCustomEndpoints('/tests', {
      UPDATE_STATUS: (id: string | number) => ({ path: `${id}` }),
    }),
  },
  AUTH: {
    LOGIN: () => '/auth/login',
    SIGNUP: () => '/auth/signup',
    LOGOUT: () => '/auth/logout',
    REFRESH_TOKEN: () => '/auth/refresh-token',
    VERIFY_EMAIL: () => '/auth/verify-email',
    RESEND_VERIFICATION_EMAIL: () => '/resend-verification-email',
    FORGOT_PASSWORD: () => '/auth/forgot-password',
    RESET_PASSWORD: () => '/auth/reset-password',
    UPDATE_USER: () => '/update-user',
  }
}

import { ENV } from '@/config'
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { store } from '@/redux/store'
import { logout as logoutAction } from '@/redux/slice/auth.slice'

export interface ApiClientConfig {
  enableTokenRefresh?: boolean
  refreshUrl?: string
  refreshMethod?: 'post' | 'get' | 'put' | 'patch' | 'delete'
  getRefreshPayload?: () => any
  extractTokens?: (response: any) => { accessToken?: string; refreshToken?: string }
  accessTokenKey?: string
  refreshTokenKey?: string
  authorizationHeader?: string
}

let config: ApiClientConfig = {
  enableTokenRefresh: true, // Enable token refresh by default
  refreshUrl: '/auth/refresh-token',
  refreshMethod: 'post',
  getRefreshPayload: () => ({}), // No payload needed since refresh token is in cookie
  extractTokens: () => ({}), // No need to extract tokens since they're in cookies
  accessTokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  authorizationHeader: 'Authorization',
}

export const configureApiClient = (cfg: Partial<ApiClientConfig>) => {
  config = { ...config, ...cfg }
}

export const api: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15000,
  withCredentials: true, // Important: enables sending/receiving cookies
})

let refreshPromise: Promise<void> | null = null

// Request interceptor - tokens are in cookies, so no Authorization header needed
api.interceptors.request.use((req) => {
  // Cookies are automatically sent with withCredentials: true
  // No need to manually set Authorization header if using cookies
  return req
})

// Response interceptor - handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isCancel(error)) return Promise.reject(error)
    
    const status = error?.response?.status
    const original = error?.config

    // Handle 401 Unauthorized - token expired, try to refresh
    if (status === 401 && config.enableTokenRefresh && !original?._retry) {
      original._retry = true

      // Prevent multiple simultaneous refresh requests
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            // Refresh token is automatically sent via cookie (withCredentials: true)
            const payload = config.getRefreshPayload ? config.getRefreshPayload() : {}
            await api.request({
              url: config.refreshUrl || '/auth/refresh-token',
              method: config.refreshMethod || 'post',
              data: payload,
            })
            // New tokens are automatically set in cookies by the backend
            // No need to extract and store tokens
          } catch (refreshError) {
            // Refresh failed - user needs to login again
            // Dispatch logout action and redirect to login
            if (typeof window !== 'undefined') {
              try {
                store.dispatch(logoutAction())
              } catch (e) {
                // If dispatch fails, just clear localStorage
                console.error('Failed to dispatch logout:', e)
              }
              window.location.href = '/login'
            }
            throw refreshError
          }
        })().finally(() => {
          refreshPromise = null
        })
      }

      // Wait for refresh to complete, then retry original request
      try {
        await refreshPromise
        // Retry the original request - new access token cookie will be sent automatically
        return api(original)
      } catch (refreshError) {
        // Refresh failed, reject with original error
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

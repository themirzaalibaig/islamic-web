import { ENV } from '@/config'
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { store } from '@/redux/store'
import { logout as logoutAction, refreshToken as refreshTokenAction } from '@/redux/slice/auth.slice'

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
  getRefreshPayload: () => ({}), // Custom payload function (if needed)
  extractTokens: () => ({}), // Custom token extraction function (if needed)
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
  withCredentials: true, // Important: enables sending/receiving cookies (if using cookie-based auth)
})

let refreshPromise: Promise<void> | null = null

// Request interceptor - Add Authorization header from stored token
api.interceptors.request.use((req) => {
  // Skip Authorization header for refresh token endpoint
  const isRefreshEndpoint = req.url?.includes('/auth/refresh-token') || 
                           req.url === config.refreshUrl
  
  if (!isRefreshEndpoint) {
    // Get token from Redux store or localStorage
    const state = store.getState()
    const token = state?.auth?.token?.accessToken || localStorage.getItem('access_token')
    
    if (token && !req.headers['Authorization']) {
      req.headers['Authorization'] = `Bearer ${token}`
    }
  }
  
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
            // Get refresh token from Redux store
            const state = store.getState()
            const refreshToken = state?.auth?.token?.refreshToken
            
            if (!refreshToken) {
              throw new Error('No refresh token available')
            }

            // Call refresh endpoint with refresh token in body
            // Request interceptor will skip adding Authorization header for refresh endpoint
            const response = await api.request({
              url: config.refreshUrl || '/auth/refresh-token',
              method: config.refreshMethod || 'post',
              data: { refreshToken }, // Send refresh token in body
            })

            // Extract new tokens from response
            const responseData = response.data
            if (responseData?.success && responseData?.data?.token) {
              const { accessToken, refreshToken: newRefreshToken } = responseData.data.token
              
              // Update Redux store with new tokens
              store.dispatch(refreshTokenAction({
                accessToken,
                refreshToken: newRefreshToken || refreshToken, // Use new token or keep old one
              }))
              
              // Update localStorage
              if (config.accessTokenKey) {
                localStorage.setItem(config.accessTokenKey, accessToken)
              }
              if (config.refreshTokenKey && newRefreshToken) {
                localStorage.setItem(config.refreshTokenKey, newRefreshToken)
              }
            } else {
              throw new Error('Invalid refresh token response')
            }
          } catch (refreshError) {
            // Refresh failed - user needs to login again
            if (typeof window !== 'undefined') {
              try {
                store.dispatch(logoutAction())
                // Clear localStorage
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
              } catch (e) {
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
        // Update the Authorization header with new token
        const newToken = store.getState()?.auth?.token?.accessToken
        if (newToken && original) {
          original.headers = original.headers || {}
          original.headers['Authorization'] = `Bearer ${newToken}`
        }
        // Retry the original request
        return api(original)
      } catch {
        // Refresh failed, reject with original error
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

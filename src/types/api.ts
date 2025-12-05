import type { UseQueryOptions, UseInfiniteQueryOptions, InfiniteData, QueryKey } from '@tanstack/react-query'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ToastOptions } from 'react-toastify'

/**
 * Standard API Response structure
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T | null
  errors?: ValidationError[] | null
  meta?: ResponseMeta | undefined
  timestamp: string
}

/**
 * Validation error structure for form fields
 */
export interface ValidationError {
  field: string
  message: string
  code?: string | undefined
  value?: unknown
}

/**
 * Metadata for pagination and other response info
 */
export interface ResponseMeta {
  pagination?: PaginationMeta
  version?: string
  [key: string]: any
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage?: number | null
  prevPage?: number | null
}

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

/**
 * Options for the useApi hook
 */
export interface UseApiOptions<TData = any, TError = any, TVariables = any> {
  /** Enable/disable the query */
  enabled?: boolean
  /** Require authentication for this request */
  auth?: boolean
  /** HTTP method for the initial query (defaults to GET) */
  method?: HttpMethod
  /** Custom headers */
  headers?: Record<string, string>
  /** Toast notification options */
  toastOptions?: ToastOptions
  /** Axios config override */
  axiosConfig?: AxiosRequestConfig
  /** TanStack Query options */
  queryConfig?: Partial<UseQueryOptions<TData, TError, TData>>
  /** Debounce time in ms for the query */
  debounceMs?: number
  /** Throttle time in ms for the query */
  throttleMs?: number
  /** Optimistic update function for mutations */
  optimisticUpdate?: (oldData: TData | undefined, variables: TVariables) => TData
  /** Automatically attempt optimistic updates for collections */
  autoOptimistic?: boolean
  /** Path to the collection in the response data for auto-optimistic updates */
  collectionPath?: string
  /** Function to get ID from an item for auto-optimistic updates */
  getId?: (item: any) => any
  /** Suppress success/error toasts */
  silent?: boolean
  /** Callback on success */
  onSuccess?: (data: TData) => void
  /** Callback on error */
  onError?: (error: TError) => void
  /** Enable automatic token refresh (if supported) */
  enableTokenRefresh?: boolean
  refreshUrl?: string
  refreshMethod?: HttpMethod
  getRefreshPayload?: () => any
  extractTokens?: (response: any) => { accessToken?: string; refreshToken?: string }
}

/**
 * Configuration for a single API request
 */
export interface ApiRequest {
  url: string
  method?: HttpMethod
  data?: any
  params?: any
  config?: AxiosRequestConfig & PerRequestConfig
}

export interface ParallelRequest<T = any> {
  key: QueryKey
  request: ApiRequest
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
}

export interface InfiniteApiRequest {
  getNextPageParam?: (lastPage: any, allPages: any[]) => any
  initialPageParam?: any
}

export interface PerRequestConfig {
  silent?: boolean
  queryKey?: QueryKey
}

/**
 * Return value of the useApi hook
 */
export interface UseApiReturn<TData = any, TError = any, TVariables = any> {
  data: TData | undefined
  response: AxiosResponse<TData> | undefined
  meta?: ResponseMeta | undefined
  validationErrors?: ValidationError[] | null
  isLoading: boolean
  isFetching: boolean
  isPending: boolean
  isError: boolean
  isSuccess: boolean
  error: TError | null
  status: 'idle' | 'loading' | 'error' | 'success'
  isMutating: boolean

  // CRUD methods
  get: <TResponse = TData>(config?: AxiosRequestConfig & PerRequestConfig) => Promise<AxiosResponse<TResponse>>
  post: <TResponse = TData, TBody = TVariables>(data?: TBody, config?: AxiosRequestConfig & PerRequestConfig) => Promise<AxiosResponse<TResponse>>
  put: <TResponse = TData, TBody = TVariables>(data?: TBody, config?: AxiosRequestConfig & PerRequestConfig) => Promise<AxiosResponse<TResponse>>
  patch: <TResponse = TData, TBody = TVariables>(data?: TBody, config?: AxiosRequestConfig & PerRequestConfig) => Promise<AxiosResponse<TResponse>>
  del: <TResponse = TData>(config?: AxiosRequestConfig & PerRequestConfig) => Promise<AxiosResponse<TResponse>>

  request: <R = TData>(req: ApiRequest & PerRequestConfig) => Promise<AxiosResponse<R>>
  uploadFile: <TResponse = TData>(file: File | File[], config?: AxiosRequestConfig & PerRequestConfig) => Promise<AxiosResponse<TResponse>>

  parallel: <T = any>(
    requests: ParallelRequest<T>[],
  ) => Array<{
    data: T | undefined
    isLoading: boolean
    isError: boolean
    error: any
    key: QueryKey
  }>

  batch: (requests: ApiRequest[]) => Promise<AxiosResponse<any>[]>
  invalidate: (keys?: QueryKey) => Promise<void>
  refetch: () => Promise<void>
  setData: (updater: (old: TData | undefined) => TData) => void
  remove: () => void
  cancel: () => void
  setAuth: (enabled: boolean, token?: string) => void
  makeKey: (url: string, params?: any) => QueryKey

  useInfiniteApi: <TInfiniteData = any, TInfiniteError = any>(
    infiniteOptions?: InfiniteApiRequest &
      UseInfiniteQueryOptions<TInfiniteData, TInfiniteError, InfiniteData<TInfiniteData>>,
  ) => {
    data: InfiniteData<TInfiniteData> | undefined
    fetchNextPage: (options?: any) => void
    hasNextPage: boolean | undefined
    isFetchingNextPage: boolean
    isError: boolean
    error: TInfiniteError | null
    refetch: () => void
  }

  mutate: (variables: TVariables, options?: any) => void
  mutateAsync: (variables: TVariables) => Promise<TData>
}

export interface ApiClientConfig {
  enableTokenRefresh?: boolean
  refreshUrl?: string
  refreshMethod?: HttpMethod
  getRefreshPayload?: () => any
  extractTokens?: (response: any) => { accessToken?: string; refreshToken?: string }
  accessTokenKey?: string
  refreshTokenKey?: string
  authorizationHeader?: string
}


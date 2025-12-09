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
    RESEND_VERIFICATION_EMAIL: () => '/auth/resend-verification-email',
    FORGOT_PASSWORD: () => '/auth/forgot-password',
    RESET_PASSWORD: () => '/auth/reset-password',
    UPDATE_USER: () => '/auth/update-user',
  },
  HADITH: {
    ...createCustomEndpoints('/hadith', {
      COLLECTIONS: () => ({ path: 'collections' }),
      COLLECTION: (collectionName: string) => ({ path: `collections/${collectionName}` }),
      COLLECTION_BOOKS: (collectionName: string) => ({ path: `collections/${collectionName}/books` }),
      COLLECTION_BOOK: (collectionName: string, bookNumber: string) => ({
        path: `collections/${collectionName}/books/${bookNumber}`,
      }),
      COLLECTION_BOOK_CHAPTERS: (collectionName: string, bookNumber: string) => ({
        path: `collections/${collectionName}/books/${bookNumber}/chapters`,
      }),
      COLLECTION_BOOK_HADITHS: (collectionName: string, bookNumber: string) => ({
        path: `collections/${collectionName}/books/${bookNumber}/hadiths`,
      }),
      COLLECTION_HADITH: (collectionName: string, hadithNumber: string) => ({
        path: `collections/${collectionName}/hadiths/${hadithNumber}`,
      }),
      RANDOM_HADITH: () => ({ path: 'hadiths/random' }),
    }),
  },
}

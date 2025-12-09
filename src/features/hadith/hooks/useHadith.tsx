import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants/endpoint'
import type {
  Collection,
  Book,
  Chapter,
  Hadith,
  RandomHadith,
  PaginatedResponse,
  ApiResponse,
} from '../types'

export const useHadith = () => {
  const api = useApi(['hadith'], '', {
    auth: true,
    enabled: false,
  })

  // Get all collections
  const getCollections = async () => {
    const { data } = await api.get<{ collections: Collection[] }>({
      url: ENDPOINTS.HADITH.COLLECTIONS(),
    })
    console.log(data)
    return data.collections
  }

  // Get collection by name
  const getCollection = async (collectionName: string) => {
    const response = await api.get<ApiResponse<{ collection: Collection }>>({
      url: ENDPOINTS.HADITH.COLLECTION(collectionName),
    })
    return response.data
  }

  // Get books by collection
  const getBooks = async (collectionName: string) => {
    const response = await api.get<ApiResponse<{ books: Book[] }>>({
      url: ENDPOINTS.HADITH.COLLECTION_BOOKS(collectionName),
    })
    return response.data
  }

  // Get book by number
  const getBook = async (collectionName: string, bookNumber: string) => {
    const response = await api.get<ApiResponse<{ book: Book }>>({
      url: ENDPOINTS.HADITH.COLLECTION_BOOK(collectionName, bookNumber),
    })
    return response.data
  }

  // Get chapters by book
  const getChapters = async (collectionName: string, bookNumber: string) => {
    const response = await api.get<ApiResponse<{ chapters: Chapter[] }>>({
      url: ENDPOINTS.HADITH.COLLECTION_BOOK_CHAPTERS(collectionName, bookNumber),
    })
    return response.data
  }

  // Get hadiths by book with pagination
  const getHadithsByBook = async (
    collectionName: string,
    bookNumber: string,
    params?: { page?: number; limit?: number },
  ) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Hadith>>>({
      url: ENDPOINTS.HADITH.COLLECTION_BOOK_HADITHS(collectionName, bookNumber),
      params,
    })
    return response.data
  }

  // Get hadith by number
  const getHadith = async (collectionName: string, hadithNumber: string) => {
    const response = await api.get<ApiResponse<{ hadith: Hadith }>>({
      url: ENDPOINTS.HADITH.COLLECTION_HADITH(collectionName, hadithNumber),
    })
    return response.data
  }

  // Get random hadith
  const getRandomHadith = async () => {
    const response = await api.get<ApiResponse<{ hadith: RandomHadith }>>({
      url: ENDPOINTS.HADITH.RANDOM_HADITH(),
    })
    return response.data
  }

  return {
    getCollections,
    getCollection,
    getBooks,
    getBook,
    getChapters,
    getHadithsByBook,
    getHadith,
    getRandomHadith,
  }
}

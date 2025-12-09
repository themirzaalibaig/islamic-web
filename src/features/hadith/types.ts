import type { ApiResponse, ValidationError, PaginationMeta } from '@/types/api'

// Re-export common types
export type { ApiResponse, ValidationError, PaginationMeta }

// Pagination Response Type
export interface PaginatedResponse<T> {
  hadiths: T[]
  total: number
  limit: number
  previous: number | null
  next: number | null
}

// Collection Types
export interface SubCollection {
  lang: string
  title: boolean | string
  shortIntro: number | string
}

export interface Collection {
  name: string
  hasBooks: boolean
  hasChapters: boolean
  totalHadith: number
  totalAvailableHadith: number
  collection: SubCollection[]
}

// Book Types
export interface Book {
  bookNumber: string
  hadithStartNumber: string
  numberOfHadith: string
  book: {
    lang: string
    name: boolean | string
  }[]
  totalAvailableHadith: number
}

// Chapter Types
export interface ChapterInfo {
  lang: string
  chapterNumber: string
  chapterTitle: string
  intro: string
  ending: string | null
}

export interface Chapter {
  bookNumber: string
  chapterId: string
  chapter: ChapterInfo[]
}

// Hadith Types
export interface Grade {
  grade: string
  name: string
}

export interface GradeWithGradedBy {
  graded_by: string
  grade: string
}

export interface Reference {
  book: string
  hadith: string
}

export interface HadithInfo {
  lang: string
  chapterNumber: string
  chapterTitle: string
  body: string
  grades?: Grade[]
  reference?: Reference
}

export interface HadithInfoWithUrn {
  lang: string
  chapterNumber: string
  chapterTitle: string
  urn: number
  body: string
  grades?: GradeWithGradedBy[]
}

export interface Hadith {
  hadithNumber: string
  hadith: HadithInfo[]
}

export interface RandomHadith {
  collection: string
  bookNumber: string
  chapterId: string
  hadithNumber: string
  hadith: HadithInfoWithUrn[]
}

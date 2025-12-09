import type { IdentifiableType, TimestampType, ActiveType } from '@/types'

export interface Dua extends IdentifiableType, TimestampType, ActiveType {
  title: string
  arabic: string
  transliteration?: string
  translation: string
  category: string
  categoryId?: string
  reference?: string
  audioUrl?: string
}

export interface DuaCategory extends IdentifiableType {
  name: string
  nameArabic?: string
  description?: string
  icon?: string
}

export interface DuasResponse {
  duas: Dua[]
  total?: number
}

export interface DuaResponse {
  dua: Dua
}

export interface DuaCategoriesResponse {
  categories: DuaCategory[]
}


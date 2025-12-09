import type { IdentifiableType, TimestampType, ActiveType, ApiResponse } from "@/types"
import type { User } from "@/types/user"

export interface Tasbeeh extends IdentifiableType, TimestampType, ActiveType {
  name: string
  text: string
  target: number
  user?: User | null
  userId?: string
}

export type TasbeehPreset = {
  id: string
  name: string
  text: string
  defaultTarget: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateTasbeehDto {
  name: string
  text: string
  target: number
}

export interface UpdateTasbeehDto {
  name?: string
  text?: string
  target?: number
  isActive?: boolean
}

export interface TasbeehsResponse extends ApiResponse<{ tasbeehs: Tasbeeh[] }> {
  tasbeehs: Tasbeeh[]
}

export interface TasbeehResponse extends ApiResponse<{ tasbeeh: Tasbeeh }> {
  tasbeeh: Tasbeeh
}
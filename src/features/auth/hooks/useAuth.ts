import { useContext } from 'react'
import { AuthContext } from '@/features/auth/context/AuthProvider'

export const useAuth = () => useContext(AuthContext)

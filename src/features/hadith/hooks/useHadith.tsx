import { useApi } from '@/hooks'
import { ENDPOINTS } from '@/constants/endpoint'

export const useHadith = () => {
  const { get } = useApi([], '', { auth: true, enabled: false })


  const getCollections = async () => {
    const response = await get({url:ENDPOINTS.HADITH.COLLECTIONS()})
    return response.data
  }

  return {
    getCollections,
  }
}

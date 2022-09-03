import { useQuery } from 'react-query'
import { Notice } from '../@types/types'
import { supabase } from '../utils/supabase'

export const useQueryNotices = () => {
  const getNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) {
      throw new Error(error.message)
    }
    return data
  }

  return useQuery<Notice[], Error>({
    queryKey: ['notices'],
    queryFn: getNotices,
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
}

import { useQueryClient, useMutation } from 'react-query'
import { EditedNotice, Notice } from '../@types/types'
import useStore from '../store'
import { supabase } from '../utils/supabase'

export const useMutateNotice = () => {
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedNotice)

  const createNoticeMutation = useMutation(
    async (notice: Omit<Notice, 'created_at' | 'id'>) => {
      const { data, error } = await supabase.from('notices').insert(notice)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        const previousNotices = queryClient.getQueryData<Notice[]>('notices')
        if (previousNotices) {
          queryClient.setQueryData(['notices'], [...previousNotices, res[0]])
        }
        reset()
      },
      onError: (error: any) => {
        alert(error.message)
        reset()
      },
    }
  )

  const updateNoticeMutation = useMutation(
    async (notice: EditedNotice) => {
      const { data, error } = await supabase
        .from('notices')
        .update({ content: notice.content })
        .eq('id', notice.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>('notices')
        if (previousNotices) {
          queryClient.setQueryData(
            ['notices'],
            previousNotices.map((notice) => {
              notice.id === variables.id ? res[0] : notice
            })
          )
        }
        reset()
      },
      onError: (error: any) => {
        alert(error.message)
        reset()
      },
    }
  )

  const deleteNoticeMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousNotice = queryClient.getQueryData<Notice[]>('notices')
        if (previousNotice) {
          queryClient.setQueryData(
            ['notices'],
            previousNotice.filter((notice) => notice.id !== variables)
          )
        }
        reset()
      },
      onError: (error: any) => {
        alert(error.message)
        reset()
      },
    }
  )

  return { createNoticeMutation, updateNoticeMutation, deleteNoticeMutation }
}

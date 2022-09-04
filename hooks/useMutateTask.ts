import { useMutation, useQueryClient } from 'react-query'

import useStore from '../store'
import { Task, EditedTask } from '../@types/types'
import { supabase } from '../utils/supabase'

export const useMutateTask = () => {
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedTask)

  const createTaskMutation = useMutation(
    async (task: Omit<Task, 'created_at' | 'id'>) => {
      const { data, error } = await supabase.from('todos').insert(task)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos')
        if (previousTodos) {
          queryClient.setQueryData(['todos'], [...previousTodos, res[0]])
        }
        reset()
      },
      onError: (error: any) => {
        alert(error.message)
        reset()
      },
    }
  )

  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ title: task.title })
        .eq('id', task.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos')
        if (previousTodos) {
          queryClient.setQueryData(
            ['todos'],
            previousTodos.map((task) =>
              task.id === variables.id ? res[0] : task
            )
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

  const deleteTaskMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase.from('todos').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos')
        if (previousTodos) {
          queryClient.setQueryData(
            ['todos'],
            previousTodos.filter((task) => task.id !== variables)
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

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}

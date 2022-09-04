import { DocumentTextIcon, LogoutIcon } from '@heroicons/react/solid'
import { NextPage } from 'next'
import React from 'react'
import { Layout } from '../components/Layout'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { supabase } from '../utils/supabase'

const Dashboard: NextPage = () => {
  const signOut = () => {
    supabase.auth.signOut()
  }
  return (
    <Layout title="Dashboard">
      <LogoutIcon
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
      <div className="grid grid-cols-2 gap-40">
        <div>
          <div className="my-3 flex justify-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
          </div>
          <TaskForm />
          <TaskList />
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

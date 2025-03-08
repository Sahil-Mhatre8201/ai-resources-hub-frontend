import React from 'react'
import RepositoryList from './RepositoryList'

const RepositoryListSection = ({data}) => {
  return (
    <main className="container mx-auto py-8">
      <RepositoryList repositories={data} />
    </main>
  )
}

export default RepositoryListSection
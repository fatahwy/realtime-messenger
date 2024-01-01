import React from 'react'
import WrapperBodyChat from './components/WrapperBodyChat'

async function page() {
  return (
    <WrapperBodyChat>
      <div className='h-full flex justify-center items-center'>
        Select a chat or start a new conversation
      </div>
    </WrapperBodyChat>
  )
}

export default page
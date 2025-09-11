import React, { useState } from 'react'
import LeftSideBar from '../components/LeftSideBar'
import ChatBox from '../components/ChatBox'
import RightSideBar from '../components/RightSideBar'
import { ChatContext } from '../../context/ChatContext'

function HomePage() {

  const {selectedUser} = React.useContext(ChatContext)

  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
        <div className={`backdrop-blur-sm border-2 [border-color:aliceblue] rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative
          ${ selectedUser? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
          <LeftSideBar/>
          <ChatBox/>
          <RightSideBar/>
        </div>
    </div>
  )
}

export default HomePage
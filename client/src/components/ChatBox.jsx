import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets'

function ChatBox({userSelected, setUserSelected}) {

  const scrollEnd = useRef()

  useEffect(()=>{
    if (scrollEnd.current){
      scrollEnd.current.scrollIntoView({behaviour : smooth})
    }
  },[])

  return userSelected ?
   ( 
    <div className='relative backdrop-blur-lg h-full overflow-scroll  '>

      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={userSelected.profilePic} alt="profile-pic" className='w-8 rounded-full' />
        <p className='flex items-center flex-1 text-lg text-white gap-2'>
          {userSelected?.fullName}
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img onClick={()=> setUserSelected(null)} src={assets.arrow_icon} alt="arrow-icon" className='bg-black-500 md:hidden max-w-7' />
        <img src={assets.help_icon} alt="help-icon" className='max-md:hidden max-w-5' />
      </div>

      {/* Chat-Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg,index)=>{
          return (
          <div className={`flex items-end gap-2 justify-end ${msg.senderId !== '680f50e4f10f3cd28382ecf9' && 'flex-row-reverse' }`} key={index}>
            {
            msg.image
            ? (
              <img src={msg.image} alt="msg img" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
            )
            : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === '680f50e4f10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
            )
          }
          <div className="text-center text-xs">
            <img src={msg.senderId=== '680f50e4f10f3cd28382ecf9'  ? assets.avatar_icon : assets.profile_martin} alt="" className='rounded-full w-7' />
            <p className='text-gray-500'>{msg.createdAt}</p>
          </div>
          </div>)
        })}
        <div ref={scrollEnd}></div>
      </div>
    </div>
  )
  :(
  <div className='relative flex items-center justify-center flex-col gap-2 text-gray-500 bg-white/10 max-md:hiddens h-full'>
    <img src={assets.logo_big} alt="logo" className='max-w-20' />
    <p className='text-lg font-medium text-white'>Connect with friends anytime, anywhere </p>
  </div>
  )
}

export default ChatBox
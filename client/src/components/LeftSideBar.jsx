import React from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'

function LeftSideBar({userSelected, setUserSelected}) {

  const navigate = useNavigate()

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${userSelected? 'max-md:hidden' : ''} `}>
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img src={assets.menu_icon} alt="menu_icon" className="max-h-5 cursor-pointer" />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-grey-600 text-grey-100 hidden group-hover:block'>
              <p onClick={()=>navigate('/profile')} className="cursor-pointer text-sm">Edit Profile</p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={''} className="cursor-pointer text-sm">Log Out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar
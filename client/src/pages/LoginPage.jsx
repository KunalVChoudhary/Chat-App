import React, { useState } from 'react'
import assets from '../assets/assets'

function LoginPage() {

  const [currState, setCurrState] = useState('Sign up')

  const [userInfo, setUserInfo] = useState({
    fullName:'',
    email:'',
    password:'',
    bio:''
  })

  const [termsAccepted, setTermsAccepted] = useState(false);

  const onChangeFormData = (e) => {
    setUserInfo((prev) => ({...prev, [e.target.name]: e.target.value}))
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }
    console.log(userInfo);
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* Left */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />
      {/* Right */}
      <form action="" onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          <img src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />
        </h2>

        {(currState === 'Sign up') &&  
        (
          <input onChange={onChangeFormData} type="text" name='fullName' className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder='Full Name' required />
        )}

        <input onChange={onChangeFormData} type="email" name="email" placeholder='Email Address' className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required  /> 

        <input onChange={onChangeFormData} type="password" name="password" placeholder='Password' className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />     

        {(currState === 'Sign up') &&  
        (
          <textarea onChange={onChangeFormData} name="bio" rows={4} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder='Provide a short bio' required></textarea>
        )}

        <button type="submit" className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === 'Sign up' ? 'Create Account' : 'Login'}
        </button>

        <div className='flex items-center gap-2 text-sm text=gray-500'>
          <input type="checkbox" onClick={()=>{setTermsAccepted(!termsAccepted)}}  />
          <p>Agree to the terms of use and privacy policy</p>
        </div>

        <div className="flex flex-col gap-2">
          {currState==='Sign up'
          ? (
            <p className="text-sm text-gray-600">
              Already Have an account?
              <span onClick={() => setCurrState('Login')} className="font-medium text-violet-500 cursor-pointer">Login here</span>
            </p>
          )
          : (
            <p className="text-sm text-gray-600">
              Create an account?
              <span onClick={() => setCurrState('Sign up')} className="font-medium text-violet-500 cursor-pointer">Click here</span>
            </p>
          )
          }
        </div>

       </form>
    </div>
  )
}

export default LoginPage
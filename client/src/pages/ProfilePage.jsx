import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

function ProfilePage() {

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState('Martin Johnson');
  const [bio, setBio] = useState('HI i am using chat app');

  const onSubmitHandler = async (e) => {
    e.preventDefault(); 
    navigate('/');

  }

  return (
    <div className='min-h-screen flex justify-center items-center bg-cover bg-no-repeat'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl border-2 border-gray-600 rounded-lg flex items-center justify-between max-sm:flex-col-reverse'>
        <div className='flex flex-col items-center text-white text-2xl font-semibold gap-1 py-5'>
          <img src={assets.logo_big} className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' alt="" />
          <p>Chat App</p>
        </div>
        <form action="" onSubmit={onSubmitHandler} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className="text-lg">Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=> setSelectedImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} alt=""  className={`w-12 h-12 ${selectedImage && 'rounded-full'}`}/>
            Upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" required placeholder='Your Name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} type="text" required placeholder='Your Bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
          <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>Save Profile</button>
        </form>
        
      </div>
    </div>
  ) 
}

export default ProfilePage
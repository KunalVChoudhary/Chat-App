import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import axios from 'axios';
import { AuthContext } from '../../context/authContext.jsx';
import { toast } from 'react-toastify';

function ProfilePage() {

  const { authUser} = useContext(AuthContext)

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState((authUser && authUser.fullName) || '');
  const [bio, setBio] = useState((authUser && authUser.bio) || '');

  const onSubmitHandler = async (e) => {
    e.preventDefault(); 
    if (!selectedImage) {
      const response = await axios.put('/api/user/update-profile', { fullName: name , bio, profilePic: '' });
      if (response.data.success){toast.success('Profile updated successfully');}else {toast.error('Some error occurred');}
    }
    else {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64data = reader.result;
        const response = await axios.put('/api/user/update-profile', { fullName: name , bio, profilePic: base64data });
        if (response.data.success) {toast.success('Profile updated successfully');}else {toast.error('Some error occurred');}
      } 
    }
    navigate('/');
    return;
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
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : authUser?.profilePic || assets.avatar_icon} alt=""  className={`w-15 h-15 rounded-full ${selectedImage && 'rounded-full'}`}/>
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
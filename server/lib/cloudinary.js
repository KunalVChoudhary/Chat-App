// Require the cloudinary library
import {v2 as cloudinary} from 'cloudinary';

// Configure cloudinary with your credentials
cloudinary.config({ 
  cloud_name: process.env.Cloudinary_Cloud_Name, 
  api_key: process.env.Cloudinary_API_Key, 
  api_secret: process.env.Cloudinary_API_Secret,
  urlAnalytics : false
});

// Export the configured cloudinary instance
export default cloudinary;
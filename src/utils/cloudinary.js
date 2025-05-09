import { v2 as cloudinary } from "cloudinary"
import fs from 'fs'

  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, 
  });

   const uploadfileoncloudinary = async (localpath)=>{
         try{
            if(!localpath) return null;
          const uploadfile = await  cloudinary.uploader.upload(localpath, {
            resource_type : "auto"
          });
          fs.unlinkSync(localpath);
          return uploadfile;
         }
         catch(err)
         {
          fs.unlinkSync(localpath)
         }
   }

   export { uploadfileoncloudinary };




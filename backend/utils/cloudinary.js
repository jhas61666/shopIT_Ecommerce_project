// utils/cloudinary.js
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: 'backend/config/config.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a file (Base64 string or buffer) to Cloudinary
export const upload_file = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type: "auto",
        folder,
      },
      (error, result) => {
        if (error) {
          console.log("Cloudinary Upload Error:", error);
          return reject(error);
        }

        resolve({
          public_id: result.public_id,
          url: result.url,
        });
      }
    );
  });
};
// Delete a file from Cloudinary
export const delete_file = async (file) => {
  const res = await cloudinary.uploader.destroy(file);

  if (res?.result === "ok") return true;
};

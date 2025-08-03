import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.CLOUDNIARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_SECRECT_KEY,
});

export default cloudinary;

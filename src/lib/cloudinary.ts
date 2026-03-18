import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Upload an image to Cloudinary
 * @param fileBase64 - The file content as a base64 string
 * @param shopId - The shopId to organize images by folder
 */
export async function uploadImage(fileBase64: string, shopId: string) {
  try {
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: `craftory/${shopId}/products`,
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'craftory_uploads',
      transformation: [
        { width: 800, quality: 'auto', fetch_format: 'auto', crop: 'limit' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

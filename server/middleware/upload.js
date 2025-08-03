const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Use memory storage for manual upload control
const memoryStorage = multer.memoryStorage();

// Create multer instance with memory storage
const upload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Manual upload function for Cloudinary
const uploadToCloudinary = async (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const defaultOptions = {
            folder: 'artosia-paintings',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto' }
            ],
            ...options
        };

        cloudinary.uploader.upload_stream(
            defaultOptions,
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        ).end(buffer);
    });
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
    try {
        // Extract public_id from Cloudinary URL
        const publicId = extractPublicIdFromUrl(imageUrl);
        if (!publicId) {
            console.log('Could not extract public_id from URL:', imageUrl);
            return null;
        }

        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary delete result:', result);
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

// Function to extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
    try {
        if (!url || typeof url !== 'string') return null;

        // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/public_id.extension
        const urlParts = url.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');

        if (uploadIndex === -1) return null;

        // Get everything after 'upload/v1234567/' or 'upload/'
        let pathAfterUpload = urlParts.slice(uploadIndex + 1);

        // Remove version if present (starts with 'v' followed by numbers)
        if (pathAfterUpload[0] && pathAfterUpload[0].match(/^v\d+$/)) {
            pathAfterUpload = pathAfterUpload.slice(1);
        }

        // Join the remaining path and remove file extension
        const publicIdWithExtension = pathAfterUpload.join('/');
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');

        return publicId;
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
};

module.exports = {
    upload,
    uploadToCloudinary,
    deleteFromCloudinary,
    extractPublicIdFromUrl,
    memoryUpload: upload
};

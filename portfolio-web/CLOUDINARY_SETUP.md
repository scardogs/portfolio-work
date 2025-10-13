# Cloudinary Setup Guide

Your portfolio admin now includes **Cloudinary integration** for image management! 🎉

## Features

✅ **Upload images** directly from admin panel  
✅ **Browse gallery** of all uploaded images  
✅ **Select from gallery** - reuse previously uploaded images  
✅ **Auto-optimization** - Cloudinary optimizes images automatically  
✅ **CDN delivery** - Fast image loading from Cloudinary's global CDN

---

## Setup Instructions

### Step 1: Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click **Sign Up** (it's free!)
3. Complete the registration

### Step 2: Get Your Credentials

After logging in:

1. Go to your **Dashboard**
2. You'll see your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Add to `.env.local`

Update your `portfolio-web/.env.local` file to include:

```env
# MongoDB (existing)
MONGODB_URI=mongodb+srv://...

# JWT Secret (existing)
JWT_SECRET=...

# Cloudinary Credentials (NEW)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important:** Replace `your_cloud_name_here`, `your_api_key_here`, and `your_api_secret_here` with your actual Cloudinary credentials from the dashboard.

### Step 4: Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

## How to Use

### Uploading Images

1. Go to any admin management page:

   - **About** - Profile image
   - **Projects** - Project images
   - **Skills** - Skill icons

2. You'll see an **ImageUploader** component with two options:
   - **Upload New** - Upload a new image from your computer
   - **Choose from Gallery** - Select from previously uploaded images

### Upload New Image

1. Click **"Upload New"** button
2. Select an image from your computer
3. Wait for upload to complete
4. Image URL will be automatically saved

**Supported formats:** JPG, PNG, GIF, WebP, etc.  
**Max size:** 5MB per image

### Choose from Gallery

1. Click **"Choose from Gallery"** button
2. A modal will open showing all your uploaded images
3. Click on any image to select it
4. Click outside or the X to close the modal
5. Selected image will be applied

### Clear Image

Click the **"Clear"** button to remove the selected image.

---

## Image Management

### Where are images stored?

All images are stored in your Cloudinary account in the **`portfolio`** folder.

### Viewing all images

1. Go to any admin page with image upload
2. Click **"Choose from Gallery"**
3. All your uploaded images will be displayed

### Managing images in Cloudinary

You can also manage images directly in Cloudinary:

1. Log in to [Cloudinary](https://cloudinary.com/)
2. Go to **Media Library**
3. Find the `portfolio` folder
4. You can:
   - View all images
   - Delete images
   - Organize into subfolders
   - Apply transformations

---

## Benefits

### 🚀 Performance

- Images delivered via global CDN
- Automatic format optimization (WebP for modern browsers)
- Lazy loading support

### 💾 Storage

- No need to store large images in your repository
- Cloudinary handles all storage
- Free tier: 25GB storage, 25GB monthly bandwidth

### 🎨 Flexibility

- Reuse images across multiple projects/skills
- Easy to update images across your portfolio
- Automatic image optimization and resizing

---

## Troubleshooting

### Upload fails with "Upload failed"

**Check:**

1. Image size (must be < 5MB)
2. Image format (use common formats: JPG, PNG, GIF)
3. Cloudinary credentials in `.env.local`
4. Server is restarted after adding credentials

### Gallery shows "No images"

**Reason:** You haven't uploaded any images yet.

**Solution:** Click "Upload New" to upload your first image!

### Images not loading

**Check:**

1. Cloudinary credentials are correct
2. Images exist in your Cloudinary account
3. Check browser console for errors

---

## API Routes

The following API routes handle Cloudinary operations:

- `POST /api/cloudinary/upload` - Upload new image
- `GET /api/cloudinary/images` - Fetch all images from gallery
- `DELETE /api/cloudinary/delete` - Delete image (if needed)

All routes are **protected** - require admin authentication.

---

## Free Tier Limits

Cloudinary free tier includes:

- ✅ 25 GB storage
- ✅ 25 GB monthly bandwidth
- ✅ 25,000 transformations/month
- ✅ All basic features

Perfect for a portfolio website! 🎊

---

## Example Usage

### Admin Dashboard Flow

1. Login to admin panel
2. Go to "Manage Projects"
3. Click "Add Project"
4. For project image:
   - **First time:** Click "Upload New" → Select image
   - **Reusing image:** Click "Choose from Gallery" → Select image
5. Fill other details
6. Click "Create"

Your project image is now hosted on Cloudinary! 🚀

---

## Need Help?

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com/)

Enjoy your new image management system! 📸

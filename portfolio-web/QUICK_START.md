# Quick Start Guide - Portfolio Admin Module

## 🚀 Quick Setup (5 minutes)

### Step 1: Add Environment Variables

Create a file named `.env.local` in the `portfolio-web` folder:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here

# JWT Secret
JWT_SECRET=your-secret-key-at-least-32-characters-long

# Cloudinary (for image uploads - optional but recommended)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Get MongoDB URI:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (Free tier is fine)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

### Step 2: Run the Application

```bash
cd portfolio-web
npm run dev
```

### Step 3: Seed Initial Data (Optional)

To populate your database with your existing project and skill data:

**Option 1: Using curl**

```bash
curl -X POST http://localhost:3000/api/seed/initial-data
```

**Option 2: Using browser**

- Open: `http://localhost:3000/api/seed/initial-data` (will show method not allowed)
- Use a tool like Postman to send a POST request

**Option 3: Manually add through admin panel**

- Skip this step and add data manually through the admin interface

### Step 4: Create Admin Account

1. Open: `http://localhost:3000/admin/register`
2. Fill in:
   - Username: your_username
   - Email: your_email@example.com
   - Password: at least 6 characters
3. Click "Register"

### Step 5: Access Admin Dashboard

You'll be automatically redirected to the dashboard after registration, or you can:

1. Go to: `http://localhost:3000/admin/login`
2. Enter your credentials
3. Start managing your portfolio!

## 📋 Admin Features at a Glance

| Feature      | What You Can Do                      | URL                      |
| ------------ | ------------------------------------ | ------------------------ |
| **About**    | Edit name, bio, languages, education | `/admin/manage/about`    |
| **Projects** | Add, edit, delete projects           | `/admin/manage/projects` |
| **Skills**   | Add, edit, delete skills             | `/admin/manage/skills`   |
| **Contact**  | Update social links, email, phone    | `/admin/manage/contact`  |

## 🔒 Security Features

✅ JWT-based authentication  
✅ Password hashing with bcrypt  
✅ Protected API routes  
✅ 7-day token expiration  
✅ Public read, Admin write access

## 🌐 Public vs Admin

**Public Pages** (Anyone can view):

- `/` - Main portfolio
- `/portfolio-tab` - Portfolio sections

**Admin Pages** (Login required):

- `/admin/login` - Login page
- `/admin/register` - Registration page
- `/admin/dashboard` - Admin dashboard
- `/admin/manage/*` - Management pages

## 📝 Quick Tips

1. **Images**: Place images in the `public` folder and reference them as `/imagename.png`
2. **Order**: Use the "order" field to control display sequence (lower numbers appear first)
3. **Logout**: Click the logout button in the dashboard to end your session
4. **Token**: Your login token is stored in browser localStorage and expires after 7 days

## 🆘 Common Issues

**Can't connect to MongoDB?**

- Check your MONGODB_URI in `.env.local`
- Verify your IP is whitelisted in MongoDB Atlas (Network Access)
- Ensure database user has read/write permissions

**Not authenticated?**

- Login again at `/admin/login`
- Clear browser localStorage if issues persist
- Check if your token expired (7 days)

**Data not showing?**

- Run the seed script to populate initial data
- Or manually add data through admin panels

## 📚 Full Documentation

For detailed information:

- `ADMIN_SETUP.md` - Admin module setup
- `CLOUDINARY_SETUP.md` - Image upload setup (recommended!)

---

## 📸 Cloudinary Setup (Optional but Recommended)

For image uploads in the admin panel, set up Cloudinary:

1. Create free account at [Cloudinary.com](https://cloudinary.com/)
2. Get your credentials from dashboard
3. Add to `.env.local` (see above)
4. See `CLOUDINARY_SETUP.md` for detailed instructions

Without Cloudinary, you can still manually add image URLs.

---

**You're all set! 🎉**

Start by visiting: `http://localhost:3000/admin/register`

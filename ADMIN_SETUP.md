# Portfolio Admin Module Setup Guide

This guide will help you set up and use the admin module for your portfolio website.

## Prerequisites

- MongoDB database (MongoDB Atlas recommended)
- Node.js installed
- npm or yarn package manager

## Installation

1. **Install Dependencies**

   ```bash
   cd portfolio-web
   npm install
   ```

2. **Configure Environment Variables**

   Create a `.env.local` file in the `portfolio-web` directory with the following variables:

   ```env
   # MongoDB Connection String
   # Get this from MongoDB Atlas or your MongoDB instance
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

   # JWT Secret for Authentication
   # Generate a random strong string for production
   JWT_SECRET=your-secret-key-change-in-production-use-a-long-random-string
   ```

   **How to get MongoDB URI:**

   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier available)
   - Click "Connect" > "Connect your application"
   - Copy the connection string and replace `<password>` with your database password

## Getting Started

1. **Start the Development Server**

   ```bash
   npm run dev
   ```

2. **Register an Admin Account**

   - Navigate to: `http://localhost:3000/admin/register`
   - Create your admin account with:
     - Username
     - Email
     - Password (minimum 6 characters)

3. **Login to Admin Dashboard**
   - Navigate to: `http://localhost:3000/admin/login`
   - Use your credentials to login
   - You'll be redirected to the admin dashboard

## Admin Features

### Dashboard

- **URL:** `/admin/dashboard`
- Central hub for all admin operations
- Quick links to manage all sections

### Manage About Section

- **URL:** `/admin/manage/about`
- Edit your name, profile image, description
- Update languages and education information

### Manage Projects

- **URL:** `/admin/manage/projects`
- **Create** new projects
- **Edit** existing projects
- **Delete** projects
- Set project order for display
- Add GitHub links and website URLs
- Upload project images

### Manage Skills

- **URL:** `/admin/manage/skills`
- **Create** new skills
- **Edit** existing skills
- **Delete** skills
- Set skill order for display
- Specify icon paths

### Manage Contact Information

- **URL:** `/admin/manage/contact`
- Update Facebook link and username
- Update email address
- Update mobile number

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new admin
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token (protected)

### About Section

- `GET /api/about` - Get about data (public)
- `PUT /api/about` - Update about data (protected)

### Projects

- `GET /api/projects` - Get all projects (public)
- `POST /api/projects` - Create a project (protected)
- `GET /api/projects/[id]` - Get single project (public)
- `PUT /api/projects/[id]` - Update a project (protected)
- `DELETE /api/projects/[id]` - Delete a project (protected)

### Skills

- `GET /api/skills` - Get all skills (public)
- `POST /api/skills` - Create a skill (protected)
- `GET /api/skills/[id]` - Get single skill (public)
- `PUT /api/skills/[id]` - Update a skill (protected)
- `DELETE /api/skills/[id]` - Delete a skill (protected)

### Contact

- `GET /api/contact` - Get contact data (public)
- `PUT /api/contact` - Update contact data (protected)

## Security

- All admin routes are protected with JWT authentication
- Passwords are hashed using bcrypt before storage
- Tokens expire after 7 days
- Only authenticated admins can modify data
- Public users can only view (GET) data

## Troubleshooting

### Cannot connect to MongoDB

- Verify your MONGODB_URI is correct
- Check if your IP address is whitelisted in MongoDB Atlas
- Ensure your database user has proper permissions

### Authentication errors

- Clear browser localStorage and login again
- Verify JWT_SECRET is set in .env.local
- Check if token has expired (7 day expiry)

### Data not updating

- Check browser console for errors
- Verify you're logged in and token is valid
- Check network tab for API response errors

## File Structure

```
portfolio-web/
├── src/
│   ├── lib/
│   │   └── mongodb.js          # MongoDB connection
│   ├── models/
│   │   ├── Admin.js            # Admin user model
│   │   ├── About.js            # About section model
│   │   ├── Project.js          # Project model
│   │   ├── Skill.js            # Skill model
│   │   └── Contact.js          # Contact model
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── login.js        # Login page
│   │   │   ├── register.js     # Registration page
│   │   │   ├── dashboard.js    # Admin dashboard
│   │   │   └── manage/
│   │   │       ├── about.js    # Manage about section
│   │   │       ├── projects.js # Manage projects
│   │   │       ├── skills.js   # Manage skills
│   │   │       └── contact.js  # Manage contact
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login.js
│   │       │   ├── register.js
│   │       │   └── verify.js
│   │       ├── about/
│   │       │   └── index.js
│   │       ├── projects/
│   │       │   ├── index.js
│   │       │   └── [id].js
│   │       ├── skills/
│   │       │   ├── index.js
│   │       │   └── [id].js
│   │       └── contact/
│   │           └── index.js
│   └── component/
│       ├── AboutSection.js     # Updated to fetch from API
│       ├── ProjectsSection.js  # Updated to fetch from API
│       ├── SkillsSection.js    # Updated to fetch from API
│       └── ContactSection.js   # Updated to fetch from API
└── .env.local                  # Environment variables (create this)
```

## Production Deployment

1. **Update Environment Variables**

   - Use a strong, random JWT_SECRET
   - Ensure MONGODB_URI points to your production database

2. **Build the Application**

   ```bash
   npm run build
   ```

3. **Start Production Server**

   ```bash
   npm start
   ```

4. **Deploy to Vercel** (Recommended)
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the code comments in the API files
3. Check browser console and network tab for errors

## Notes

- The first time you access the public portfolio pages, default data will be created in MongoDB
- You can have multiple admin accounts
- Images should be placed in the `public` folder
- Image paths in the admin should start with `/` (e.g., `/profile.png`)

# Rubica.com - Premium Classified Ads Platform

A modern, full-stack web application replicating the functionality of Skokka.in, built with Node.js, Express, MongoDB, React, and TypeScript. Features a beautiful design using the Montserrat font family and a professional pink/purple color scheme.

![Rubica Homepage](https://via.placeholder.com/800x400/e91e63/ffffff?text=Rubica.com)

## 🚀 Features

### Backend Features
- **RESTful API** built with Express.js and TypeScript
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with secure user sessions
- **User Management** with registration, login, and profile management
- **Ad Management** with CRUD operations, categories, and search
- **Category System** with hierarchical organization
- **Location-based Search** with city and state filtering
- **File Upload Support** with Cloudinary integration
- **Advanced Filtering** by price, location, category, etc.
- **Favorites System** for saving preferred ads
- **Security Features** including rate limiting, helmet, and CORS
- **Input Validation** with express-validator

### Frontend Features
- **Modern React** application with TypeScript
- **Responsive Design** that works on all devices
- **Styled Components** for component-level styling
- **React Query** for efficient data fetching and caching
- **React Router** for client-side routing
- **Context API** for global state management
- **Toast Notifications** for user feedback
- **Form Handling** with React Hook Form
- **Protected Routes** for authenticated users
- **Search Functionality** with real-time filtering
- **Beautiful UI** using Montserrat font family

### Design Features
- **Montserrat Font Family** throughout the application
- **Modern Color Palette** with pink/purple primary colors
- **Responsive Grid Layouts**
- **Smooth Animations** and transitions
- **Professional Typography** scale
- **Accessible Design** patterns
- **Loading States** and error handling
- **Mobile-First** responsive design

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Express Validator for input validation
- Helmet for security
- CORS for cross-origin requests
- Rate limiting for API protection

### Frontend
- React 19
- TypeScript
- Styled Components
- React Router DOM
- React Query (TanStack Query)
- React Hook Form
- React Icons
- React Toastify
- Axios for HTTP requests

### Development Tools
- Nodemon for backend development
- Concurrently for running multiple scripts
- ESLint and Prettier for code quality

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd rubica-website
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Return to root directory
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rubica
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d

# Cloudinary configuration (optional for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email configuration (optional for notifications)
EMAIL_FROM=noreply@rubica.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

Start MongoDB service on your machine, then seed the database:
```bash
cd server
node seed.js
```

This will create sample categories, users, and ads for testing.

### 5. Run the Application

From the root directory:
```bash
# Run both backend and frontend simultaneously
npm run dev

# Or run them separately:
# Backend only (http://localhost:5000)
npm run server

# Frontend only (http://localhost:3000)
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
rubica-website/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Common components
│   │   │   └── layout/         # Layout components
│   │   ├── contexts/           # React Context providers
│   │   ├── pages/              # Page components
│   │   │   ├── ads/            # Ad-related pages
│   │   │   ├── auth/           # Authentication pages
│   │   │   └── user/           # User-related pages
│   │   ├── utils/              # Utility functions
│   │   ├── App.tsx             # Main App component
│   │   └── index.tsx           # Entry point
│   ├── package.json
│   └── tsconfig.json
├── server/                     # Node.js backend
│   ├── middleware/             # Express middleware
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API route handlers
│   ├── uploads/                # File upload directory
│   ├── index.js                # Express server
│   ├── seed.js                 # Database seeder
│   └── package.json
├── package.json                # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Ads
- `GET /api/ads` - Get all ads with filtering
- `GET /api/ads/:id` - Get single ad
- `POST /api/ads` - Create new ad (protected)
- `PUT /api/ads/:id` - Update ad (protected)
- `DELETE /api/ads/:id` - Delete ad (protected)
- `GET /api/ads/user/my-ads` - Get user's ads (protected)
- `POST /api/ads/:id/favorite` - Toggle favorite (protected)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

### Cities
- `GET /api/cities` - Get popular cities
- `GET /api/cities/search` - Search cities

### Users
- `GET /api/users/:username` - Get user profile by username

## 🎨 Design System

### Color Palette
- **Primary**: #e91e63 (Pink)
- **Primary Dark**: #ad1457
- **Secondary**: #2196f3 (Blue)
- **Success**: #4caf50
- **Warning**: #ff9800
- **Error**: #f44336

### Typography
- **Font Family**: Montserrat (Primary), Sans-serif (Fallback)
- **Font Weights**: 300, 400, 500, 600, 700, 800
- **Font Sizes**: 0.75rem to 3rem (responsive scale)

### Spacing System
- **Base Unit**: 0.25rem (4px)
- **Scale**: xs(4px), sm(8px), md(16px), lg(24px), xl(32px), 2xl(48px), 3xl(64px)

### Breakpoints
- **Mobile**: < 480px
- **Tablet**: 768px
- **Desktop**: 1024px
- **Large**: 1200px

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent API abuse
- **CORS** configuration for cross-origin requests
- **Helmet** for security headers
- **Input Validation** on all endpoints
- **Protected Routes** for authenticated content
- **Environment Variables** for sensitive data

## 🧪 Testing

### Sample Login Credentials
After running the seed script, you can use these credentials:
- Username: `sarah_j` | Password: `password123`
- Username: `mike_w` | Password: `password123`
- Username: `emma_d` | Password: `password123`
- Username: `alex_b` | Password: `password123`

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables in your hosting platform
2. Update MONGODB_URI to point to MongoDB Atlas
3. Set NODE_ENV to "production"
4. Deploy the server directory

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the build directory
3. Update REACT_APP_API_URL to your backend URL

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update MONGODB_URI in environment variables
3. Whitelist your server's IP address

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Legal Notice

This software is intended for educational and development purposes. Ensure compliance with local laws and regulations when deploying or using this application for adult content or services.

## 🆘 Support

For support, email support@rubica.com or create an issue in the repository.

---

**Built with ❤️ using modern web technologies**


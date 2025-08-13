# Rubica.com - Premium Classified Ads Platform

A complete full-stack classified ads website similar to Skokka.in, built with modern technologies and featuring a beautiful, responsive design using the Montserrat font family.

## 🚀 Features

### Frontend
- **Modern React Application** with Redux Toolkit for state management
- **Beautiful UI/UX** with Montserrat font family and custom CSS
- **Responsive Design** that works on all devices
- **Search Functionality** with filters by category, city, and price
- **User Authentication** with protected routes
- **Real-time Notifications** using React Hot Toast
- **Smooth Animations** with Framer Motion
- **Form Handling** with React Hook Form and Yup validation

### Backend
- **RESTful API** built with Node.js and Express
- **MongoDB Database** with Mongoose ODM
- **JWT Authentication** with secure token management
- **Input Validation** using Express Validator
- **Error Handling** with custom middleware
- **Rate Limiting** and security features
- **File Upload** support with Multer
- **Search Functionality** with MongoDB text indexes

### Categories
- Call Girls / Escort Services
- Massage Therapy
- Male Escorts
- Transgender Services
- Adult Entertainment

## 🛠️ Technology Stack

### Frontend
- React 18
- Redux Toolkit with RTK Query
- React Router DOM
- React Hook Form
- Yup validation
- Axios
- React Hot Toast
- Lucide React (icons)
- Framer Motion
- Custom CSS with Montserrat font

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcryptjs for password hashing
- Express Validator
- Multer for file uploads
- Helmet for security
- Morgan for logging
- Compression
- CORS

## 📁 Project Structure

```
rubica-website/
├── backend/
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── public/           # Static files
│   └── server.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store & slices
│   │   └── App.js        # Main App component
│   └── public/           # Static assets
└── package.json          # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rubica-website
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   npm run backend:install
   
   # Install frontend dependencies
   npm run frontend:install
   ```

3. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rubica
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   COOKIE_EXPIRE=7
   BCRYPT_ROUNDS=12
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run backend:dev    # Backend on http://localhost:5000
   npm run frontend:dev   # Frontend on http://localhost:3000
   ```

## 🗄️ Database Setup

### MongoDB Local Setup
1. Install MongoDB locally
2. Start MongoDB service
3. Database will be created automatically on first run

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` file

### Sample Data
The application includes seed data for:
- Categories (Call Girls, Massage, Male Escorts, Transgender)
- Cities (Major Indian cities)
- Sample listings

## 🔐 Authentication & Authorization

### User Roles
- **User**: Can create and manage their own listings
- **Premium**: Enhanced listing features
- **Admin**: Full system access

### JWT Authentication
- Secure token-based authentication
- Automatic token refresh
- Protected routes for authenticated users

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user profile
- `GET /api/auth/logout` - Logout user

### Listings Endpoints
- `GET /api/listings` - Get all listings (with search/filter)
- `GET /api/listings/featured` - Get featured listings
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing (auth required)
- `PUT /api/listings/:id` - Update listing (auth required)
- `DELETE /api/listings/:id` - Delete listing (auth required)

### Categories Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/tree` - Get category tree
- `GET /api/categories/:id` - Get single category

### Cities Endpoints
- `GET /api/cities` - Get all cities
- `GET /api/cities/featured` - Get featured cities
- `GET /api/cities/popular` - Get popular cities

## 🎨 Design System

### Typography
- **Primary Font**: Montserrat (all weights)
- **Fallback**: Sans-serif system fonts

### Color Palette
- **Primary**: Blue (#0284c7) to Purple (#7c3aed) gradient
- **Secondary**: Yellow (#eab308) accents
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Gray Scale**: From #f9fafb to #111827

### Components
- Custom button styles with hover effects
- Form components with validation states
- Card layouts with shadows and transitions
- Responsive grid system
- Loading states and animations

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px and above
- **Tablet**: 768px to 1199px
- **Mobile**: Below 768px

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** with bcryptjs
- **Rate Limiting** to prevent abuse
- **Input Validation** on all endpoints
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **MongoDB Injection** protection

## 🚀 Deployment

### Backend Deployment (Node.js)

1. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

2. **Build and Start**
   ```bash
   cd backend
   npm install
   npm start
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy** the `build` folder to any static hosting service:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

### Full Stack Deployment Options

1. **Heroku**
   - Deploy backend to Heroku
   - Deploy frontend to Netlify/Vercel
   - Configure CORS for production domains

2. **DigitalOcean**
   - Use App Platform for both frontend and backend
   - MongoDB Atlas for database

3. **AWS**
   - EC2 for backend
   - S3 + CloudFront for frontend
   - MongoDB Atlas or DocumentDB

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies

### Backend
- Database indexing
- Query optimization
- Response compression
- Caching with Redis (optional)

## 🔧 Configuration

### Frontend Configuration
- Proxy setup for development
- Environment-specific API URLs
- Build optimization settings

### Backend Configuration
- MongoDB connection options
- JWT settings
- File upload limits
- Security headers

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Legal Disclaimer

This software is for educational and demonstration purposes. Users are responsible for ensuring compliance with local laws and regulations regarding adult content and classified advertisements.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@rubica.com
- Documentation: [Project Wiki]

## 🙏 Acknowledgments

- React and Node.js communities
- MongoDB for database solution
- All open-source contributors
- Design inspiration from modern classified platforms

---

**Built with ❤️ using modern web technologies**
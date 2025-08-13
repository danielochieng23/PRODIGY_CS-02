# Rubica - Classified Ads Platform

A modern, full-stack classified ads platform inspired by Skokka, built with Next.js, Express.js, and MongoDB. Features a responsive design using the Montserrat font family and provides a complete marketplace experience.

## 🚀 Features

### Frontend
- **Modern UI/UX**: Beautiful, responsive design with Montserrat font family
- **Homepage**: Search functionality, category browsing, featured locations
- **Ad Listings**: Advanced filtering, pagination, and search capabilities
- **User Authentication**: Registration, login, and profile management
- **Ad Management**: Create, edit, delete, and manage classified ads
- **Image Uploads**: Multiple image support with optimization
- **Real-time Features**: Live search, notifications, and updates

### Backend
- **RESTful API**: Complete API with Express.js and MongoDB
- **Authentication**: JWT-based authentication with secure password hashing
- **File Uploads**: Image handling with Multer
- **Security**: Rate limiting, CORS, helmet, and input validation
- **Database**: MongoDB with Mongoose ODM and indexes for performance
- **Search**: Full-text search with filtering and sorting

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form with validation
- **Icons**: React Icons (Feather Icons)
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js 18.x or higher
- MongoDB 5.x or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd rubica-website
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start MongoDB (if running locally)
mongod

# Start the backend server
npm run dev
\`\`\`

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

\`\`\`bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your configuration
nano .env.local

# Start the frontend development server
npm run dev
\`\`\`

The frontend will run on `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables

\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rubica
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
\`\`\`

### Frontend Environment Variables

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Rubica
\`\`\`

## 📁 Project Structure

\`\`\`
rubica-website/
├── backend/                 # Express.js API server
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # File uploads directory
│   └── server.js           # Server entry point
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js 14 app directory
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and API client
│   │   ├── types/         # TypeScript definitions
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
└── docs/                  # Project documentation
\`\`\`

## 🗃️ Database Schema

### Collections

1. **Users**: User accounts and profiles
2. **Categories**: Ad categories and subcategories
3. **Locations**: Geographic locations (countries, states, cities)
4. **Ads**: Classified advertisements with images and details

### Key Features

- Indexed fields for performance
- Text search capabilities
- Geospatial queries support
- Data validation and constraints

## 🎨 Design System

### Typography
- **Primary Font**: Montserrat (300, 400, 500, 600, 700, 800)
- **Fallback**: Sans-serif system fonts

### Colors
- **Primary**: Red shades (#ef4444 variants)
- **Secondary**: Gray shades (#64748b variants)
- **Accent**: Yellow shades (#eab308 variants)

### Components
- Responsive design patterns
- Custom Tailwind CSS utilities
- Consistent spacing and shadows
- Smooth animations and transitions

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- File upload validation

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces
- Optimized images and performance

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Ads
- `GET /api/ads` - List ads with filters
- `GET /api/ads/:id` - Get single ad
- `POST /api/ads` - Create new ad
- `PUT /api/ads/:id` - Update ad
- `DELETE /api/ads/:id` - Delete ad

### Categories & Locations
- `GET /api/categories` - List categories
- `GET /api/locations` - List locations

## 🧪 Development

### Backend Development

\`\`\`bash
cd backend
npm run dev    # Start with nodemon
npm start      # Start production server
\`\`\`

### Frontend Development

\`\`\`bash
cd frontend
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
\`\`\`

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy to hosting service (Heroku, DigitalOcean, etc.)
4. Set up file storage (AWS S3, Cloudinary, etc.)

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar service
3. Configure environment variables
4. Set up custom domain (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Skokka.in's design and functionality
- Built with modern web technologies
- Montserrat font family by Julieta Ulanovsky
- Icons by Feather Icons

## 📞 Support

For support and questions:
- Email: support@rubica.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

---

**Rubica** - Your premier destination for classified ads. Connect, discover, and explore endless possibilities.
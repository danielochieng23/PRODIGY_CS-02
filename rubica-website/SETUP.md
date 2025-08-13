# Rubica Setup Guide

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- MongoDB 5.x or higher (or use Docker)
- npm package manager

### Option 1: Local Development

1. **Clone and setup the project:**
```bash
git clone <repository-url>
cd rubica-website
```

2. **Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed  # Seed the database with sample data
npm run dev   # Start backend on http://localhost:5000
```

3. **Frontend Setup (in a new terminal):**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your configuration
npm run dev   # Start frontend on http://localhost:3000
```

### Option 2: Docker Development

1. **Using Docker Compose:**
```bash
git clone <repository-url>
cd rubica-website
docker-compose up -d  # Start all services
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 3000

### Database Seeding

After setting up MongoDB, seed the database with sample data:

```bash
cd backend
npm run seed
```

This creates:
- 8 categories (Escort Services, Massages, etc.)
- 16 locations (countries, states, cities)
- 3 test users including admin

### Test Accounts

After seeding, you can login with:
- **Admin**: admin@rubica.com / admin123
- **User 1**: user1@test.com / password123  
- **User 2**: user2@test.com / password123

## Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS with Montserrat font
- **State**: React Context API for auth
- **API Client**: Axios with interceptors
- **Components**: Responsive design patterns

### Backend (Express.js)
- **API**: RESTful endpoints with Express
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT with bcrypt password hashing
- **Upload**: Multer for file handling
- **Security**: Helmet, CORS, rate limiting

### Database (MongoDB)
- **Users**: Authentication and profiles
- **Categories**: Ad categorization system
- **Locations**: Geographic hierarchy
- **Ads**: Classified advertisements

## Environment Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rubica
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Rubica
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server  
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Features Implemented

### ✅ Core Features
- [x] Modern homepage with search functionality
- [x] Category and location browsing
- [x] User authentication (register/login)
- [x] Responsive design with Montserrat font
- [x] Database schema and API endpoints
- [x] File upload support
- [x] Security middleware
- [x] Docker containerization

### 🚧 Pending Features
- [ ] Ad listing pages with filters
- [ ] Ad posting functionality
- [ ] User dashboard
- [ ] Payment integration
- [ ] Advanced search
- [ ] Email notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Ads
- `GET /api/ads` - List ads with filters
- `GET /api/ads/:id` - Get single ad
- `POST /api/ads` - Create new ad
- `PUT /api/ads/:id` - Update ad
- `DELETE /api/ads/:id` - Delete ad

### Data
- `GET /api/categories` - List categories
- `GET /api/locations` - List locations

## Development Notes

### Font Integration
The entire application uses the Montserrat font family as specified:
- Loaded via Google Fonts CDN
- Configured in Tailwind CSS
- Applied globally with fallbacks

### Design Inspiration
Built as a replica of Skokka.in with:
- Similar homepage layout and search
- Category-based browsing
- Location-based filtering
- Modern, clean aesthetic

### Security
- JWT authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration

## Deployment

### Production Deployment
1. Set up MongoDB Atlas or self-hosted MongoDB
2. Configure environment variables
3. Build and deploy backend to cloud service
4. Build and deploy frontend to Vercel/Netlify
5. Set up file storage (AWS S3, Cloudinary)

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Support

For issues and questions:
- Check the main README.md for detailed documentation
- Review API endpoint documentation
- Check environment configuration
- Verify database connection and seeding

---

**Happy coding! 🚀**
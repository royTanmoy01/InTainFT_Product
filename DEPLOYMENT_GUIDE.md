# SpendWise - Personal Spending Intelligence Dashboard

## Project Overview

SpendWise is a comprehensive Personal Spending Intelligence Dashboard built for modern financial management. The application aggregates payment data from multiple sources and provides users with intelligent insights about their spending patterns, merchant preferences, and financial behavior.

## 🏗️ Technical Architecture

### Backend Architecture
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + OAuth 2.0 (Google)
- **Data Sources**: 
  - Razorpay Payment APIs (sandbox mode)
  - Google Places API for merchant enrichment
- **Real-time Updates**: Socket.io for live data synchronization
- **Security**: Rate limiting, data encryption, audit logging

### Frontend Architecture
- **Framework**: React 18 with functional components
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Hooks (useState, useEffect)
- **Charts**: Chart.js with react-chartjs-2
- **Routing**: React Router v6
- **Styling**: CSS Modules + Global CSS

### Data Flow
1. **Transaction Import**: Razorpay APIs → Backend Processing → MongoDB Storage
2. **Merchant Enrichment**: Google Places API → Location/Category Data → Enhanced Transactions  
3. **Analytics Engine**: Raw Transactions → AI Categorization → Spending Insights
4. **Real-time Sync**: Socket.io → Live Dashboard Updates

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud)
- Git

### Environment Setup


#### Backend Environment Variables
Create `/backend/.env` file:

JWT_SECRET=b761eadc1ccd00dada630b2f9449309be526164765f86ebbc52a4f30fe9de51a
RAZORPAY_KEY_ID=rzp_test_SybYCYbz3UcP7c
RAZORPAY_KEY_SECRET=xpK6w0WZh3NemLyTNFAbOJz3
GOOGLE_PLACES_API_KEY=AIzaSyCbmcEhQA280cAFYBAekAIY8AdDJiRlFfE
MONGODB_URI=mongodb+srv://troy:11111@cluster0.pougiuq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
GOOGLE_CLIENT_ID=1089567110298-39m5pspk3c675c27mh9qfgma3j0d8gr0.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
RAZORPAY_API_URL=https://api.razorpay.com/v1/payments
GOOGLE_PLACES_API_URL=https://maps.googleapis.com/maps/api/place/findplacefromtext/json
PORT=5000
NODE_ENV=development

```

#### Frontend Environment Variables
Create `/frontend/.env` file:

REACT_APP_API_URL=http://localhost:5000 // put your localhost api url here
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
REACT_APP_WS_URL = wss://cautious-eureka-qrrr4vw5679fw9x-5000.app.github.dev // put your localhost ws url here (similar as api url)

```

### Installation & Setup

#### 1. Clone Repository
```bash
git clone https://github.com/royTanmoy01/InTainFT_Product.git
cd InTainFT_Product
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

#### 3. Frontend Setup
```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: `http://localhost:3000`

### 🔧 Configuration Steps (Ignore)

#### 1. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API and Google Places API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Secret to environment files

#### 2. Google Places API Setup
1. In Google Cloud Console, enable Places API
2. Create API key with Places API restrictions
3. Add to backend `.env` file

#### 3. Razorpay Setup (Sandbox)
1. Sign up at [Razorpay](https://razorpay.com/)
2. Switch to test mode
3. Get API keys from dashboard
4. Add to backend `.env` file

#### 4. MongoDB Setup (Ignore)
**Local MongoDB:**
```bash
# Install MongoDB Community Edition
# macOS with Homebrew:
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Default connection: mongodb://localhost:27017
```

**MongoDB Atlas (Cloud):** (Ignore)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Add database user and whitelist IP
4. Get connection string
5. Update `MONGODB_URI` in `.env`

## 📁 Project Structure

```
InTainFT_Product/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Route handlers
│   │   ├── models/             # Database schemas
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth, logging, validation
│   │   ├── config/             # Database, passport config
│   │   └── index.js            # Server entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── utils/              # Helper functions
│   │   ├── styles/             # CSS files
│   │   ├── theme/              # MUI theme
│   │   └── index.js            # App entry point
│   ├── public/
│   ├── package.json
│   └── .env
└── README.md
```

## 🎯 Key Features

### 1. Dashboard Analytics
- **Real-time spending overview**
- **Category-wise expense breakdown**
- **Monthly spending trends**
- **Payment method analysis**
- **Geographic spending patterns**

### 2. Transaction Management
- **Import from Razorpay APIs**
- **Smart merchant categorization**
- **Advanced filtering and search**
- **Export to CSV/Excel**
- **Real-time notifications**

### 3. Intelligence Features
- **AI-powered categorization**
- **Anomaly detection**
- **Budget recommendations**
- **Recurring payment detection**
- **Spending insights**

### 4. Security & Privacy
- **JWT authentication**
- **Google OAuth integration**
- **Data encryption**
- **Audit logging**
- **Session management**

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - User logout

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions/import` - Import from Razorpay
- `GET /api/transactions/analyze` - Get spending analysis
- `GET /api/transactions/export` - Export transactions
- `POST /api/transactions/clear` - Clear all transactions

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/change-password` - Change password

## 🎨 UI/UX Features

### Modern Design System
- **Clean, minimalist interface**
- **Responsive design for all devices**
- **Smooth animations and transitions**
- **Accessible color contrasts**
- **Intuitive navigation**

### Dashboard Components
- **Interactive charts and graphs**
- **Smart data tables with filtering**
- **Real-time data updates**
- **Export functionality**
- **Mobile-optimized layouts**

## 📊 Data Sources & Integration

### Razorpay Integration
- Sandbox environment for testing
- Automatic transaction import
- Payment method tracking
- Status monitoring

### Google Places Integration
- Merchant location detection
- Business category mapping
- Address normalization
- Geographic insights

## 🔒 Security Implementation

### Authentication & Authorization
- JWT token-based authentication
- Google OAuth 2.0 integration
- Session management
- Route protection

### Data Security
- Environment variable management
- API key encryption
- Input validation and sanitization
- CORS configuration
- Rate limiting

## 📱 Responsive Design

### Mobile-First Approach
- Optimized for mobile devices
- Touch-friendly interfaces
- Collapsible navigation
- Adaptive layouts

### Cross-Platform Compatibility
- Modern browser support
- Progressive web app features
- Offline capability considerations

## 🚀 Deployment Options

### Local Development
```bash
# Start both frontend and backend
npm run dev
```

### Production Deployment

#### Backend (Node.js)
- **Heroku, AWS, DigitalOcean**
- Set production environment variables
- Configure MongoDB Atlas
- Enable SSL/HTTPS

#### Frontend (React)
- **Netlify, Vercel, AWS S3**
- Build optimized bundle: `npm run build`
- Configure environment variables
- Set up CI/CD pipeline

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity for Atlas

#### 2. Google OAuth Not Working
- Verify client ID in both frontend and backend
- Check redirect URI configuration
- Ensure APIs are enabled in Google Console

#### 3. Razorpay API Errors
- Confirm sandbox mode is enabled
- Verify API keys are correct
- Check rate limits

#### 4. Frontend Build Issues
- Clear node_modules and reinstall
- Check for conflicting dependencies
- Verify environment variables

## 📈 Performance Optimization

### Backend Optimizations
- Database indexing for fast queries
- Connection pooling
- Caching strategies
- Compression middleware

### Frontend Optimizations
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Memoization for expensive operations

## 🎯 Future Enhancements

### Planned Features
- **Machine learning insights**
- **Budget goal tracking**
- **Bill reminder system**
- **Investment tracking**
- **Multi-currency support**

### Technical Improvements
- **GraphQL API implementation**
- **Microservices architecture**
- **Real-time collaborative features**
- **Advanced analytics dashboard**

## 📞 Support & Contact

### Project Information
- **Repository**: https://github.com/royTanmoy01/InTainFT_Product
- **Developer**: Tanmoy Roy
- **Technology Stack**: MERN (MongoDB, Express, React, Node.js)

### Getting Help
1. Check this documentation
2. Review error logs in browser console
3. Verify environment variable configuration
4. Check API endpoint responses

---

## Quick Start Summary

1. **Clone repository**
2. **Setup environment variables** (MongoDB, Google APIs, Razorpay)
3. **Install dependencies** (`npm install` in both directories)
4. **Start MongoDB** service (Ignore)
5. **Run backend** (`npm run dev` in backend/)
6. **Run frontend** (`npm start` in frontend/)
7. **Access application** at `http://localhost:3000`

The application will be ready for testing with sample data import and Google OAuth authentication!

# SpendWise - Secure Deployment Guide

## 🔒 SECURITY NOTICE
**NEVER share actual API keys, secrets, or credentials in documentation, emails, or public repositories.**

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud)
- Git

### Environment Setup

#### Backend Environment Variables
Create `/backend/.env` file with YOUR OWN credentials:

```env
# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here

# Razorpay Configuration (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Google API Configuration (Get from https://console.cloud.google.com/)
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# API URLs
RAZORPAY_API_URL=https://api.razorpay.com/v1/payments
GOOGLE_PLACES_API_URL=https://maps.googleapis.com/maps/api/place/findplacefromtext/json

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend Environment Variables
Create `/frontend/.env` file:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000

# Map Configuration
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

## 🔧 API Setup Instructions

### 1. Razorpay Setup
1. Sign up at https://razorpay.com/
2. Switch to test mode
3. Go to Settings → API Keys
4. Generate new test keys
5. Add to your `.env` file

### 2. Google APIs Setup
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable Google+ API and Places API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Create API key for Places API
7. Add all credentials to your `.env` file

### 3. MongoDB Setup
1. Sign up at https://www.mongodb.com/atlas (free tier)
2. Create new cluster
3. Create database user with strong password
4. Whitelist your IP address
5. Get connection string
6. Add to your `.env` file

## 🛡️ Security Best Practices

### Environment Variables
- ✅ Keep `.env` files in `.gitignore`
- ✅ Use different credentials for development/production
- ✅ Generate strong, unique secrets
- ❌ NEVER commit credentials to git
- ❌ NEVER share credentials via email/chat

### JWT Security
- Use cryptographically secure random strings (256-bit minimum)
- Generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### API Key Management
- Rotate keys regularly
- Use least privilege access
- Monitor usage for anomalies
- Revoke unused keys immediately

## 📁 Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/royTanmoy01/InTainFT_Product.git
cd InTainFT_Product
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create your .env file with YOUR credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create your .env file
npm start
```

## 🎯 Key Features
- Real-time spending analytics
- Secure authentication with JWT + OAuth
- Transaction import from Razorpay
- Merchant categorization with Google Places
- Export functionality
- Mobile-responsive design

## 📱 Demo & Testing
- Use Razorpay test mode for safe testing
- Google OAuth works with localhost during development
- All sensitive operations are logged and audited

## 🚀 Production Deployment
- Use production MongoDB cluster
- Set NODE_ENV=production
- Use HTTPS for all endpoints
- Enable proper CORS settings
- Use production API keys

## 📞 Support
For technical questions about setup (without sharing credentials):
- Create GitHub issues
- Check console logs for errors
- Verify environment variable names

---

**Remember: Keep your credentials secure and never share them publicly!**

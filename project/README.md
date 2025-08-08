# TrustyLads E-commerce Platform

> Premium streetwear for Gen Z India. Bold designs, authentic style.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-teal.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- MongoDB 7.x
- Redis (optional, for caching)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/trustylads/ecommerce-platform.git
   cd ecommerce-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Server will run on**
   ```
   http://localhost:5000
   ```

## 🏗️ Project Structure

```
trustylads-ecommerce/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ToastNotification.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── CartSidebar.tsx
│   │   └── ProductCard.tsx
│   ├── pages/                    # Page components
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrderSuccessPage.tsx
│   │   ├── TrackOrderPage.tsx
│   │   ├── AdminPanel.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   └── useAuth.ts
│   ├── store/                    # State management (Zustand)
│   │   ├── useCartStore.ts
│   │   └── useAuthStore.ts
│   ├── types/                    # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── order.ts
│   │   ├── product.ts
│   │   └── user.ts
│   ├── utils/                    # Utility functions
│   │   ├── api.ts
│   │   ├── analytics.ts
│   │   ├── helpers.ts
│   │   └── razorpay.ts
│   ├── context/                  # React contexts
│   │   └── ThemeContext.tsx
│   └── assets/                   # Static assets
├── backend/                      # Backend source code
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── models/               # Database models
│   │   ├── middleware/           # Express middleware
│   │   ├── services/             # Business logic services
│   │   ├── utils/                # Backend utilities
│   │   └── types/                # Backend TypeScript types
│   └── package.json
├── docker/                       # Docker configuration
│   ├── Dockerfile
│   └── docker-compose.yml
├── public/                       # Static public files
├── package.json                  # Frontend dependencies
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Neon Yellow (#FFE135)
- **Secondary**: Pure Black (#000000)
- **Background**: Pure White (#FFFFFF)
- **Accent**: Gray (#6B7280)

### Typography
- **Headings**: Montserrat (Bold, SemiBold)
- **Body**: Inter (Regular, Medium)
- **Accent**: Custom streetwear font

### Components
All components follow atomic design principles and are fully responsive with mobile-first approach.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.x with TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.x
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js 4.x
- **Database**: MongoDB 7.x with Mongoose 8.x
- **Authentication**: JWT with refresh tokens
- **File Upload**: Cloudinary
- **Email**: Brevo/AWS SES
- **Payments**: Razorpay
- **Caching**: Redis
- **Validation**: Express Validator

### DevOps & Deployment
- **Frontend**: Vercel
- **Backend**: Railway/Render
- **Database**: MongoDB Atlas
- **CDN**: Cloudinary
- **Monitoring**: Sentry
- **Analytics**: Google Analytics 4

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_GA_MEASUREMENT_ID=your_ga_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trustylads
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## 📱 Features

### Customer Features
- **Product Catalog**: Browse shirts, watches, and jewelry
- **Advanced Search**: Filter by category, price, size, and more
- **Product Details**: High-quality images, specifications, reviews
- **Shopping Cart**: Add, remove, update quantities
- **Checkout**: Multiple payment options (Razorpay, COD)
- **Order Tracking**: Real-time order status updates
- **Responsive Design**: Optimized for all devices

### Admin Features
- **Dashboard**: Sales analytics and key metrics
- **Order Management**: View, update, and track orders
- **Product Management**: CRUD operations for products
- **Customer Management**: View customer data and orders
- **Analytics**: Detailed reports and insights

### Technical Features
- **PWA Ready**: Offline support and app-like experience
- **SEO Optimized**: Meta tags, structured data, sitemap
- **Performance**: Lazy loading, code splitting, caching
- **Security**: JWT authentication, input validation, rate limiting
- **Accessibility**: WCAG 2.1 AA compliant
- **Analytics**: Google Analytics 4, Facebook Pixel

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Environment Variables**
   Set up environment variables in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Backend (Railway)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy**
   ```bash
   cd backend
   railway up
   ```

3. **Environment Variables**
   Set up environment variables in Railway dashboard

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Set up database user and network access
3. Get connection string and add to environment variables

## 🧪 Testing

### Frontend Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Backend Testing
```bash
cd backend

# Unit tests
npm run test

# Integration tests
npm run test:integration

# API tests
npm run test:api
```

## 📊 Performance

### Lighthouse Scores (Target)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 95+

### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

## 🔒 Security

### Frontend Security
- Content Security Policy (CSP)
- XSS protection
- HTTPS enforcement
- Secure cookie handling

### Backend Security
- JWT with refresh tokens
- Rate limiting
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

## 📈 Analytics & Monitoring

### Analytics
- Google Analytics 4
- Facebook Pixel
- Custom event tracking
- E-commerce tracking

### Monitoring
- Error tracking with Sentry
- Performance monitoring
- Uptime monitoring
- Log aggregation

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📝 API Documentation

### Base URL
```
Production: https://api.trustylads.com
Development: http://localhost:5000
```

### Authentication
```bash
# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@trustylads.com",
  "password": "password"
}
```

### Products
```bash
# Get all products
GET /api/products?category=shirts&page=1&limit=12

# Get single product
GET /api/products/:id

# Create product (Admin only)
POST /api/products
Authorization: Bearer <token>
```

### Orders
```bash
# Create order
POST /api/orders
Content-Type: application/json

# Get order
GET /api/orders/:orderId

# Track order
GET /api/orders/:orderId/track
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 5173
   npx kill-port 5173
   ```

2. **MongoDB connection failed**
   - Check MongoDB is running
   - Verify connection string
   - Check network access in MongoDB Atlas

3. **Build fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Environment variables not loading**
   - Check file name (.env.local for frontend)
   - Restart development server
   - Verify variable names start with VITE_

## 📞 Support

### Contact Information
- **Email**: support@trustylads.com
- **WhatsApp**: +91 98765 43210
- **Instagram**: [@trustylads](https://instagram.com/trustylads)

### Documentation
- [API Documentation](https://docs.trustylads.com)
- [Component Library](https://storybook.trustylads.com)
- [Design System](https://design.trustylads.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from leading streetwear brands
- Icons by [Lucide](https://lucide.dev/)
- Images from [Pexels](https://pexels.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

**Made with ❤️ for Gen Z India by TrustyLads Team**

*"Trust your style, trust your vibe"* ✨
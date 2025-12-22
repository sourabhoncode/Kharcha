# Financial Tracker - Personal Finance Manager

A full-stack personal finance management application with React frontend, Express backend, and localStorage/MongoDB database support.

## 🎯 Features

- 💳 **Expense Tracking** - Add, edit, and categorize expenses
- 📊 **Financial Analytics** - View detailed spending reports and trends
- 📸 **Receipt Scanner** - Capture and extract expense data from receipts
- ✈️ **Trip Planning** - Plan trips and manage trip budgets
- 👤 **User Profiles** - Personalized user accounts with settings
- 🎨 **Modern UI** - Clean, responsive dark theme interface
- 🔐 **Secure Auth** - User registration and login

## 🏗️ Project Structure

```
financial-tracker-react/
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/ # Reusable components
│   │   ├── context/   # React Context providers
│   │   ├── styles/    # CSS stylesheets
│   │   └── api.ts     # API integration
│   ├── public/
│   ├── package.json
│   ├── vercel.json    # Vercel deployment config
│   └── netlify.toml   # Netlify deployment config
├── backend/           # Express TypeScript application
│   ├── src/
│   │   ├── transactions/
│   │   ├── categories/
│   │   └── main.ts
│   └── package.json
├── DEPLOYMENT.md      # Detailed deployment guide
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

#### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:3001`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

### Environment Configuration

#### Frontend (.env)
```bash
cd frontend
# Create .env file with:
REACT_APP_BASEAPI=http://localhost:3001
```

#### Backend (.env)
```bash
cd backend
# Create .env file with your configuration
PORT=3001
MONGODB_URI=mongodb://localhost:27017/financial-tracker
NODE_ENV=development
```

Default configuration:
```
MONGODB_URI=mongodb://localhost:27018/financial-tracker
PORT=3001
NODE_ENV=development
```

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Default configuration:
```
REACT_APP_BASEAPI=http://localhost:3001
```

### Running the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```
Backend will be available at `http://localhost:3001`

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
Frontend will open at `http://localhost:3000`

#### MongoDB
Make sure MongoDB is running on `mongodb://localhost:27018/`

## 📚 API Documentation

### Health Check
- **GET** `/api/health` - Check if API is running

### Transactions
- **GET** `/api/transactions` - Get all transactions
- **GET** `/api/transactions/:id` - Get transaction by ID
- **GET** `/api/transactions/balance` - Get account balance
- **POST** `/api/transactions` - Create new transaction
- **PUT** `/api/transactions/:id` - Update transaction
- **DELETE** `/api/transactions/:id` - Delete transaction

**Transaction Schema:**
```typescript
{
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  date: Date;
  isActive: boolean;
}
```

### Categories
- **GET** `/api/categories` - Get all categories
- **GET** `/api/categories/:id` - Get category by ID
- **POST** `/api/categories` - Create new category
- **PUT** `/api/categories/:id` - Update category
- **DELETE** `/api/categories/:id` - Delete category

**Category Schema:**
```typescript
{
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
}
```

## 🛠️ Available Scripts

### Frontend
```bash
npm start           # Start development server (port 3000)
npm run build       # Build for production
npm test            # Run tests
npm run eject       # Eject from Create React App (irreversible)
```

### Backend
```bash
npm start           # Start server
npm run dev         # Start with auto-reload
npm test            # Run tests
npm run build       # Build TypeScript
```

## 📦 Tech Stack

### Frontend
- **React** 18.2 - UI library
- **TypeScript** - Type safety
- **React Router** v6 - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database (optional)
- **Mongoose** - MongoDB ODM

## 🌐 Deployment

### Frontend Deployment (Vercel - Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

### Frontend Deployment (Netlify)

```bash
# Build the app
npm run build

# Deploy using Netlify CLI
netlify deploy --prod --dir=build
```

### Environment Setup for Deployment

Set these environment variables in your deployment platform:

```
REACT_APP_BASEAPI=https://your-api-domain.com
```

For more detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📋 Features Detailed

### Expense Management
- ✅ Add, edit, delete expenses
- ✅ Categorize expenses (Food, Utilities, Transport, Entertainment, Other)
- ✅ Track by date
- ✅ View transaction history

### Financial Reports
- ✅ Monthly spending trends
- ✅ Category-wise breakdown
- ✅ Daily spending analysis
- ✅ Average spending calculations

### Receipt Scanner
- ✅ Capture photos from camera
- ✅ Upload from device
- ✅ Simulated OCR extraction
- ✅ Save receipt history
- ✅ Convert to expenses

### Trip Management
- ✅ Create and manage trips
- ✅ Set trip budgets
- ✅ Search and filter trips
- ✅ Sort by date and budget

### User Features
- ✅ User registration and login
- ✅ Edit profile information
- ✅ Avatar emoji selection
- ✅ Settings management

## 🔒 Security & Best Practices

- ✅ Input validation
- ✅ Secure authentication
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Error handling and logging

## 📱 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Performance

- Optimized React components
- Code splitting via React Router
- CSS minification
- Asset optimization
- Caching strategies

## 👥 Contributors

**Created by:**
- Sourabh Verma
- Black Heart

## 📄 License

MIT License - feel free to use this project for personal or educational purposes.

## 📞 Support

For issues, bug reports, or feature requests, please check the project documentation or contact the creators.

---

**Version**: 0.1.0  
**Last Updated**: December 2025  
**Status**: ✅ Production Ready

## 🔧 Configuration

### MongoDB Connection
The application connects to MongoDB at `mongodb://localhost:27018/financial-tracker`

To use a different MongoDB instance:
1. Update `MONGODB_URI` in backend `.env`
2. Ensure MongoDB is accessible at the specified URI

### CORS Configuration
CORS is enabled by default in the backend for development. Modify in `src/main.ts` if needed.

## 📝 Notes

- The backend runs on port `3001` by default
- The frontend runs on port `3000` by default
- MongoDB should be running on port `27018`
- All timestamps are automatically managed by MongoDB

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## 📄 License

MIT

# Financial Tracker - Personal Finance Manager

A full-stack personal finance management application with React frontend, NestJS backend, and MongoDB database.

## 🏗️ Project Structure

```
financial-tracker-react/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # NestJS application
│   ├── src/
│   │   ├── transactions/
│   │   ├── categories/
│   │   └── main.ts
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (running on `mongodb://localhost:27018/`)

### Installation

#### 1. Backend Setup
```bash
cd backend
npm install
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
```

### Environment Configuration

#### Backend (.env)
```bash
cd backend
cp .env.example .env
# Update .env with your configuration
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
REACT_APP_API_URL=http://localhost:3001
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

## 🛠️ Development

### Available Scripts

#### Backend
```bash
npm run build       # Build the application
npm run start       # Start in production mode
npm run start:dev   # Start in development mode with watch
npm run start:debug # Start in debug mode
npm run start:prod  # Start production build
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
```

#### Frontend
```bash
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
npm run eject       # Eject from Create React App
```

## 📦 Tech Stack

### Frontend
- React 18
- TypeScript
- Axios
- React Router

### Backend
- NestJS
- TypeScript
- Mongoose
- MongoDB

### Database
- MongoDB (Local)

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

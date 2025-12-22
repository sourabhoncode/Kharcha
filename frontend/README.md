# React Frontend - Financial Tracker UI

## Overview
This is the frontend application for the Financial Tracker built with React and TypeScript.

## Getting Started

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

### Development
```bash
npm start
```

The application will open at `http://localhost:3000`

### Production Build
```bash
npm run build
```

## Project Structure

```
src/
├── App.tsx              # Main application component
├── App.css              # Application styles
├── index.tsx            # Application entry point
└── api.ts               # API client configuration
```

## Features

The application provides a user-friendly interface for:
- Viewing and managing transactions
- Creating and categorizing expenses and income
- Tracking account balance
- Managing transaction categories

## API Integration

The application uses Axios for API requests. Configure the API URL in `.env`:
```
REACT_APP_BASEAPI=http://localhost:3001
```

All API calls go through the `api.ts` file which provides:
- `transactionsAPI` - Transaction CRUD operations
- `categoriesAPI` - Category CRUD operations
- `healthCheck()` - API health check

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Styling

The application uses CSS modules and CSS files for styling. Main styles are in `App.css`.

## Environment Variables

Create a `.env` file with:
```
REACT_APP_BASEAPI=http://localhost:3001
```

## Building Components

To add new components, create them in the `src` directory:
```
src/
├── components/
│   ├── TransactionList.tsx
│   ├── TransactionForm.tsx
│   ├── CategorySelector.tsx
│   └── Balance.tsx
├── pages/
│   ├── Dashboard.tsx
│   └── Transactions.tsx
└── hooks/
    └── useTransactions.ts
```

## Notes

- The app is configured with TypeScript for type safety
- CORS is handled by the backend
- All API requests include proper error handling
- Environment variables must be prefixed with `REACT_APP_`

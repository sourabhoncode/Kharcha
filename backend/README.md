# NestJS Backend - Financial Tracker API

## Overview
This is the backend service for the Financial Tracker application built with NestJS, TypeScript, and MongoDB using Mongoose.

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
npm run start:dev
```

The API will be available at `http://localhost:3001`

### Production
```bash
npm run build
npm run start:prod
```

## Project Structure

```
src/
├── transactions/           # Transaction management module
│   ├── transaction.schema.ts
│   ├── transactions.service.ts
│   ├── transactions.controller.ts
│   ├── transactions.module.ts
│   └── dto/
│       └── create-transaction.dto.ts
├── categories/            # Category management module
│   ├── category.schema.ts
│   ├── categories.service.ts
│   ├── categories.controller.ts
│   ├── categories.module.ts
│   └── dto/
│       └── create-category.dto.ts
├── app.module.ts         # Root module
├── app.controller.ts     # Root controller
├── app.service.ts        # Root service
└── main.ts              # Application entry point
```

## Modules

### Transactions Module
Handles all transaction-related operations (income and expenses).

**Features:**
- Create, read, update, delete transactions
- Calculate account balance
- Filter transactions by type and category
- Track transaction dates and descriptions

### Categories Module
Manages transaction categories.

**Features:**
- Create and manage categories
- Support for colors and icons
- Category-based transaction filtering
- Unique category names

## API Routes

All routes are prefixed with `/api`

### Health Check
```
GET /api/health
```

### Transactions
```
GET    /api/transactions              - Get all
GET    /api/transactions/:id          - Get by ID
GET    /api/transactions/balance      - Get balance
POST   /api/transactions              - Create
PUT    /api/transactions/:id          - Update
DELETE /api/transactions/:id          - Delete
```

### Categories
```
GET    /api/categories                - Get all
GET    /api/categories/:id            - Get by ID
POST   /api/categories                - Create
PUT    /api/categories/:id            - Update
DELETE /api/categories/:id            - Delete
```

## Database

MongoDB is used for data persistence. Collections:
- `transactions` - Stores transaction records
- `categories` - Stores category definitions

## Scripts

- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with auto-reload
- `npm run start:debug` - Start with debugging enabled
- `npm run start:prod` - Start production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

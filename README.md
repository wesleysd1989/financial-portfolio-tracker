# Financial Portfolio Tracker

A simple web application that allows users to create financial portfolios, register trades, and visualize accumulated PnL over time, without authentication requirements.

## 🎯 Objective

This application provides a streamlined way to track investment performance by managing multiple portfolios, recording trades, and visualizing profit/loss trends through interactive charts.

## 🧱 Tech Stack

| Layer                | Technology                   |
| -------------------- | ---------------------------- |
| **Frontend**         | Next.js (App Router) + React |
| **UI/Styling**       | TailwindCSS + ShadCN UI      |
| **State Management** | React Hooks (local state)    |
| **Database**         | PostgreSQL via Docker        |
| **ORM**              | Prisma                       |
| **Charts**           | Recharts                     |
| **Language**         | TypeScript                   |

## ✅ Features

### Core Features

- **📁 Portfolio Creation**: Create and manage multiple investment portfolios with initial values
- **📝 Trade Registration**: Record buy/sell operations with detailed information (ticker, prices, quantity, dates)
- **📊 Interactive Dashboard**: Comprehensive dashboard with real-time statistics and portfolio selection
- **📈 PnL Visualization**: Interactive Recharts showing accumulated profit/loss over time with hover details
- **📋 Advanced Trade List**: Sortable and filterable trade tables with search functionality

### Advanced Features

- **✏️ Edit Trades**: Modify existing trade records with form validation and real-time PnL calculation
- **🗑️ Delete Trades**: Remove trade records with confirmation dialogs and automatic recalculation
- **📱 Responsive Design**: Dual-view system - mobile cards and desktop tables for optimal experience
- **🔍 Search & Filter**: Search trades by ticker, filter by profit/loss, sort by any column
- **📊 Real-time Stats**: Dynamic calculation of portfolio value, total P&L, win rate, and return percentage
- **🎨 Modern UI**: Clean interface using ShadCN UI components with consistent design system
- **⚡ Performance**: Built with Next.js App Router for optimal performance and SEO

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd financial-portfolio-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   ```bash
   # Start PostgreSQL container
   docker run --name portfolio-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
   ```

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your database connection string
   ```

5. **Set up Prisma**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 User Guide

### Getting Started with Your First Portfolio

1. **Navigate to Portfolios** (`/portfolios`)
   - Click "Create New Portfolio" button
   - Enter a portfolio name (e.g., "My Investment Portfolio")
   - Set an initial value (e.g., $10,000)
   - Click "Create Portfolio"

2. **Register Your First Trade** (`/trades/register`)
   - Select the portfolio you created
   - Enter ticker symbol (e.g., "AAPL")
   - Set entry price (purchase price per share)
   - Set exit price (sale price per share)
   - Enter quantity (number of shares)
   - Select trade date
   - Click "Register Trade" - P&L will be calculated automatically

3. **View Dashboard** (`/dashboard`)
   - Select your portfolio from the dropdown
   - View real-time statistics: Portfolio Value, Total P&L, Return Percentage
   - Analyze the interactive P&L chart showing cumulative performance
   - Browse recent trades or view the complete trade list

### Dashboard Features

#### Portfolio Statistics

- **Portfolio Value**: Initial value + Total P&L
- **Total P&L**: Sum of all trade profits and losses
- **Total Trades**: Number of completed trades
- **Return Percentage**: (Total P&L / Initial Value) × 100

#### Interactive P&L Chart

- **Hover Effects**: See detailed P&L information for each trade
- **Cumulative View**: Track how your portfolio performance evolves over time
- **Responsive Design**: Adapts to different screen sizes

#### Advanced Trade Management

- **Search**: Find trades by ticker symbol
- **Filter**: Show only profitable or losing trades
- **Sort**: Click column headers to sort by any field
- **Edit**: Click the edit button to modify trade details
- **Delete**: Remove trades with confirmation dialog

### Mobile Experience

- **Responsive Navigation**: Hamburger menu for mobile devices
- **Card View**: Trades displayed as cards on mobile for better readability
- **Touch-Friendly**: All buttons and interactions optimized for touch devices

## 📁 Project Structure

```
financial-portfolio-tracker/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── portfolios/         # Portfolio management pages
│   │   ├── trades/             # Trade registration and listing pages
│   │   │   └── register/       # Trade registration form
│   │   ├── api/                # API routes
│   │   │   ├── portfolios/     # Portfolio CRUD endpoints
│   │   │   └── trades/         # Trade CRUD endpoints
│   │   │       └── [id]/       # Individual trade operations
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Root layout component
│   ├── components/             # Reusable UI components
│   │   ├── charts/             # Chart components (Recharts)
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── layout/             # Layout components
│   │   ├── trade/              # Trade-related components
│   │   └── ui/                 # ShadCN UI base components
│   ├── lib/                    # Utility functions and configurations
│   ├── utils/                  # P&L calculation utilities
│   └── generated/              # Generated Prisma client
├── components/                 # Additional components (legacy structure)
├── lib/                        # Database services and Prisma setup
├── types/                      # TypeScript type definitions
├── prisma/                     # Database schema and migrations
├── public/                     # Static assets
├── docker-compose.yml          # Docker configuration for PostgreSQL
└── package.json               # Dependencies and scripts
```

## 🗃️ Database Schema

### Portfolio Model

- `id`: Unique identifier (Int, Primary Key)
- `name`: Portfolio name (String)
- `initialValue`: Starting investment amount (Float)
- `createdAt`, `updatedAt`: Timestamps (DateTime)
- `trades`: One-to-many relationship with Trade model

### Trade Model

- `id`: Unique identifier (Int, Primary Key)
- `ticker`: Stock/asset symbol (String)
- `entryPrice`: Purchase price per unit (Float)
- `exitPrice`: Sale price per unit (Float)
- `quantity`: Number of shares/units (Int)
- `date`: Trade execution date (DateTime)
- `pnl`: Calculated profit/loss (Float) - Auto-calculated on creation/update
- `portfolioId`: Reference to parent portfolio (Int, Foreign Key)
- `createdAt`, `updatedAt`: Timestamps (DateTime)
- `portfolio`: Many-to-one relationship with Portfolio model

## 📊 PnL Calculation

The application calculates profit/loss using the formula:

```
PnL = (exitPrice - entryPrice) × quantity
```

Accumulated PnL is calculated by summing all trade PnLs ordered by execution date.

## 🏗️ Technical Architecture

### Frontend Architecture

- **Next.js App Router**: Modern React framework with file-based routing
- **Client Components**: Interactive components using React hooks for state management
- **Server Components**: Static components for better performance and SEO
- **TypeScript**: Full type safety across the application

### Backend Architecture

- **API Routes**: RESTful endpoints using Next.js API routes
- **Prisma ORM**: Type-safe database operations with auto-generated client
- **PostgreSQL**: Relational database for data persistence
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality

### Component Structure

- **Atomic Design**: Components organized by complexity level
- **ShadCN UI**: Consistent design system with customizable components
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Utility Functions**: Centralized business logic for P&L calculations

### State Management

- **Local State**: React hooks (useState, useEffect) for component state
- **Server State**: API calls with loading and error states
- **Real-time Updates**: Automatic recalculation of statistics after data changes

## 🛠️ Available Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm run build`      | Build production application |
| `npm run start`      | Start production server      |
| `npm run lint`       | Run ESLint                   |
| `npm run format`     | Format code with Prettier    |
| `npm run type-check` | Run TypeScript type checking |

## 🎨 UI Components

This project uses [ShadCN UI](https://ui.shadcn.com/) components for a consistent and modern interface:

- Forms and inputs for data entry
- Tables for trade listings
- Cards for portfolio display
- Charts for PnL visualization
- Dialogs for confirmations

## 🔧 Development

### Code Quality

- **ESLint**: Code linting and style enforcement
- **Prettier**: Automatic code formatting
- **TypeScript**: Type safety and better developer experience
- **Functional Programming**: Uses functional paradigm without classes

### Database Management

```bash
# Reset database
npx prisma db push --force-reset

# View data in Prisma Studio
npx prisma studio

# Generate Prisma client
npx prisma generate
```

## 🚀 Deployment

The application can be deployed on any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Docker**

Make sure to set up environment variables and a PostgreSQL database in your deployment environment.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

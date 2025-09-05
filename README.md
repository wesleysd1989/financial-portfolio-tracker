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

- **📁 Portfolio Creation**: Create and manage multiple investment portfolios
- **📝 Trade Registration**: Record buy/sell operations with detailed information
- **📊 Trade Dashboard**: View and manage all trades with filtering capabilities
- **📈 PnL Visualization**: Interactive charts showing accumulated profit/loss over time

### Additional Features

- **🔧 Edit/Delete Trades**: Modify or remove existing trade records
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean interface using ShadCN UI components
- **⚡ Performance**: Built with Next.js App Router for optimal performance

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

## 📁 Project Structure

```
/app                 # Next.js App Router pages
  /dashboard         # Main dashboard page
  /portfolio         # Portfolio management pages
  /trade             # Trade registration pages
/components          # Reusable UI components
  /portfolio         # Portfolio-specific components
  /trade             # Trade-specific components
  /dashboard         # Dashboard components
  /ui                # ShadCN UI components
/lib                 # Utility functions and shared code
/types               # TypeScript type definitions
/prisma              # Database schema and migrations
/public              # Static assets
```

## 🗃️ Database Schema

### Portfolio Model

- `id`: Unique identifier
- `name`: Portfolio name
- `initialValue`: Starting investment amount
- `createdAt`, `updatedAt`: Timestamps

### Trade Model

- `id`: Unique identifier
- `ticker`: Stock/asset symbol
- `entryPrice`: Purchase price
- `exitPrice`: Sale price
- `quantity`: Number of shares/units
- `date`: Trade execution date
- `portfolioId`: Reference to parent portfolio

## 📊 PnL Calculation

The application calculates profit/loss using the formula:

```
PnL = (exitPrice - entryPrice) × quantity
```

Accumulated PnL is calculated by summing all trade PnLs ordered by execution date.

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

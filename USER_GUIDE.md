# 📖 Financial Portfolio Tracker - User Guide

## Table of Contents

- [Getting Started](#getting-started)
- [Creating Your First Portfolio](#creating-your-first-portfolio)
- [Recording Trades](#recording-trades)
- [Using the Dashboard](#using-the-dashboard)
- [Managing Trades](#managing-trades)
- [Understanding P&L Calculations](#understanding-pl-calculations)
- [Mobile Usage](#mobile-usage)
- [Troubleshooting](#troubleshooting)

## Getting Started

Welcome to Financial Portfolio Tracker! This application helps you track your investment performance by managing portfolios, recording trades, and visualizing your profit and loss over time.

### First Steps

1. Open your web browser and navigate to `http://localhost:3000`
2. You'll see the main dashboard with navigation options
3. Start by creating your first portfolio

## Creating Your First Portfolio

### Step 1: Navigate to Portfolios

- Click on "Portfolios" in the navigation menu
- Or click the "Manage Portfolios" card on the dashboard

### Step 2: Create New Portfolio

1. Click the "Create New Portfolio" button
2. Fill in the required information:
   - **Portfolio Name**: Give your portfolio a descriptive name (e.g., "My Stock Portfolio", "Crypto Investments")
   - **Initial Value**: Enter the starting amount you invested (e.g., $10,000)
3. Click "Create Portfolio"

### Tips for Portfolio Creation

- Use descriptive names to easily identify different investment strategies
- The initial value should represent your total starting investment
- You can create multiple portfolios for different asset classes or strategies

## Recording Trades

### Step 1: Access Trade Registration

- Click "New Trade" button on the dashboard
- Or navigate to "Trades" → "Register Trade"

### Step 2: Fill Trade Information

1. **Select Portfolio**: Choose which portfolio this trade belongs to
2. **Ticker Symbol**: Enter the stock/asset symbol (e.g., "AAPL", "BTC", "GOOGL")
3. **Entry Price**: The price you paid per unit when buying
4. **Exit Price**: The price you received per unit when selling
5. **Quantity**: Number of shares/units traded
6. **Trade Date**: When the trade was executed

### Step 3: Review and Submit

- The system automatically calculates P&L as you enter information
- Review all details for accuracy
- Click "Register Trade"
- You'll see a confirmation with the calculated P&L

### Trade Registration Tips

- **Entry vs Exit Price**: Entry is your buy price, exit is your sell price
- **Positive P&L**: Exit price higher than entry price (profit)
- **Negative P&L**: Exit price lower than entry price (loss)
- **Date Accuracy**: Use the actual trade execution date for accurate timeline analysis

## Using the Dashboard

### Portfolio Selection

1. Use the dropdown at the top to select which portfolio to view
2. All statistics and charts will update to show data for the selected portfolio

### Understanding Dashboard Statistics

#### Portfolio Value

- **Calculation**: Initial Value + Total P&L
- **Meaning**: Current worth of your portfolio based on recorded trades

#### Total P&L

- **Calculation**: Sum of all individual trade P&L values
- **Color Coding**: Green for positive (profit), red for negative (loss)

#### Return Percentage

- **Calculation**: (Total P&L ÷ Initial Value) × 100
- **Meaning**: Percentage return on your initial investment

#### Total Trades

- **Count**: Number of completed trades in the portfolio

### Interactive P&L Chart

- **Hover**: Move your mouse over data points to see detailed information
- **Timeline**: X-axis shows trade dates, Y-axis shows cumulative P&L
- **Trend Analysis**: Upward trend indicates growing profits, downward indicates losses

### Recent Trades Section

- Shows your 5 most recent trades
- Quick overview of recent performance
- Click "View All Trades" for complete list

## Managing Trades

### Viewing All Trades

The enhanced trade list provides comprehensive trade management:

#### Search and Filter

- **Search Box**: Type ticker symbols to find specific trades
- **Filter Dropdown**: Show only profitable trades, losses, or all trades
- **Clear Filters**: Reset search and filters to view all trades

#### Sorting

- Click any column header to sort by that field
- Click again to reverse sort order
- Available sort fields: Ticker, Entry Price, Exit Price, Quantity, Date, P&L

#### Trade Statistics

Above the trade list, you'll see:

- **Total P&L**: Sum of all visible trades
- **Winning Trades**: Number of profitable trades
- **Losing Trades**: Number of unprofitable trades
- **Win Rate**: Percentage of profitable trades

### Editing Trades

1. Click the edit icon (pencil) next to any trade
2. Modify any field in the popup form
3. P&L is automatically recalculated
4. Click "Update Trade" to save changes
5. Dashboard statistics update automatically

### Deleting Trades

1. Click the delete icon (trash) next to any trade
2. Confirm deletion in the popup dialog
3. Trade is permanently removed
4. All statistics recalculate automatically

## Understanding P&L Calculations

### Basic Formula

```
P&L = (Exit Price - Entry Price) × Quantity
```

### Examples

- **Profitable Trade**: Bought 100 AAPL at $150, sold at $160
  - P&L = ($160 - $150) × 100 = $1,000 profit
- **Loss Trade**: Bought 50 GOOGL at $2,500, sold at $2,400
  - P&L = ($2,400 - $2,500) × 50 = -$5,000 loss

### Cumulative P&L

- Each trade's P&L is added to the running total
- Chart shows how your portfolio performance evolves over time
- Helps identify trends and trading patterns

## Mobile Usage

### Navigation

- Tap the hamburger menu (☰) to access navigation
- Menu shows detailed descriptions for each section

### Mobile-Optimized Views

- **Trade List**: Displays as cards instead of tables for better readability
- **Charts**: Adjusted height and touch-friendly interactions
- **Forms**: Optimized input fields and buttons for touch devices

### Touch Interactions

- **Tap**: Select items and buttons
- **Scroll**: Navigate through long lists
- **Pinch/Zoom**: Interact with charts (where supported)

## Troubleshooting

### Common Issues

#### "No portfolios available" message

- **Solution**: Create a portfolio first before registering trades
- **Navigation**: Go to Portfolios → Create New Portfolio

#### Trade form shows validation errors

- **Check**: All required fields are filled
- **Verify**: Prices are positive numbers
- **Confirm**: Date is in valid format
- **Ensure**: Portfolio is selected

#### Dashboard shows "Loading portfolios..."

- **Wait**: Allow time for data to load
- **Check**: Database connection is working
- **Refresh**: Reload the page if loading persists

#### Chart not displaying

- **Requirement**: Portfolio must have at least one trade
- **Solution**: Register a trade first, then view dashboard

### Performance Tips

- **Large Datasets**: Use search and filters to narrow down trade lists
- **Mobile Performance**: Close unused browser tabs for better performance
- **Chart Interaction**: Allow charts to fully load before interacting

### Data Accuracy

- **Double-check**: All trade information before submitting
- **Edit Carefully**: Use edit function to correct mistakes
- **Backup Strategy**: Keep external records of important trades

## Best Practices

### Portfolio Organization

- Create separate portfolios for different strategies
- Use descriptive names that make sense to you
- Set accurate initial values for meaningful return calculations

### Trade Recording

- Record trades promptly after execution
- Use consistent ticker symbol formats
- Include all fees in your entry/exit prices for accurate P&L

### Analysis

- Review the P&L chart regularly to identify trends
- Use filters to analyze specific types of trades
- Compare win rates across different time periods

---

For technical support or feature requests, please refer to the main README.md file or contact the development team.

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PnLData } from '@/types/index';

interface PnLChartProps {
  data: PnLData[];
  loading?: boolean;
  portfolioName?: string;
}

interface ChartDataPoint {
  date: string;
  pnl: number;
  cumulativePnL: number;
  ticker?: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{`Date: ${label}`}</p>
        <p className="text-sm text-blue-600">
          {`Cumulative P&L: $${data.cumulativePnL.toFixed(2)}`}
        </p>
        <p className="text-sm text-gray-600">
          {`Trade P&L: ${data.pnl >= 0 ? '+' : ''}$${data.pnl.toFixed(2)}`}
        </p>
        {data.ticker && (
          <p className="text-sm text-gray-500">{`Ticker: ${data.ticker}`}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function PnLChart({ data, loading = false, portfolioName = 'Portfolio' }: PnLChartProps) {
  // Format data for Recharts
  const chartData: ChartDataPoint[] = data.map(item => ({
    date: item.date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: data.length > 30 ? 'numeric' : undefined 
    }),
    pnl: item.value,
    cumulativePnL: item.cumulativeValue,
    ticker: item.ticker
  }));

  // Determine line color based on final P&L
  const finalPnL = chartData.length > 0 ? chartData[chartData.length - 1].cumulativePnL : 0;
  const lineColor = finalPnL >= 0 ? '#10b981' : '#ef4444'; // green for profit, red for loss
  const fillColor = finalPnL >= 0 ? '#10b98110' : '#ef444410'; // light green/red for area

  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"/>
            <path d="m19 9-5 5-4-4-3 3"/>
          </svg>
        </div>
        <p className="text-gray-600 text-center">
          No trade data available for {portfolioName}
          <br />
          <span className="text-sm text-gray-500">Add some trades to see the P&L chart</span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Cumulative P&L Over Time
        </h3>
        <p className="text-sm text-gray-600">
          {portfolioName} • {data.length} trade{data.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="w-full h-64 sm:h-80 bg-white rounded-lg border border-gray-200 p-2 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
            <Line 
              type="monotone" 
              dataKey="cumulativePnL" 
              stroke={lineColor}
              strokeWidth={2}
              fill={fillColor}
              activeDot={{ 
                r: 6, 
                fill: lineColor,
                stroke: '#fff',
                strokeWidth: 2
              }}
              dot={{ 
                r: 3, 
                fill: lineColor,
                strokeWidth: 0
              }}
              name="Cumulative P&L ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary statistics */}
      <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total P&L</p>
          <p className={`text-lg font-semibold ${finalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {finalPnL >= 0 ? '+' : ''}${finalPnL.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Best Trade</p>
          <p className="text-lg font-semibold text-green-600">
            +${Math.max(...data.map(d => d.value)).toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Worst Trade</p>
          <p className="text-lg font-semibold text-red-600">
            ${Math.min(...data.map(d => d.value)).toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Trade</p>
          <p className="text-lg font-semibold text-gray-700">
            ${(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

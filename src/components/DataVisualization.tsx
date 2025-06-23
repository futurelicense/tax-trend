
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TaxCreditData } from '@/pages/Dashboard';

interface DataVisualizationProps {
  data: TaxCreditData[];
  showDetailed?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

export const DataVisualization: React.FC<DataVisualizationProps> = ({ data, showDetailed = false }) => {
  // Aggregate data by year for trend analysis
  const yearlyData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.year === item.Year);
    if (existing) {
      existing.totalAmount += item.Claimed_Amount;
      existing.totalClaims += item.Claims_Count;
    } else {
      acc.push({
        year: item.Year,
        totalAmount: item.Claimed_Amount,
        totalClaims: item.Claims_Count
      });
    }
    return acc;
  }, [] as Array<{ year: number; totalAmount: number; totalClaims: number; }>)
  .sort((a, b) => a.year - b.year);

  // Aggregate data by credit type
  const creditTypeData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.type === item.Tax_Credit_Type);
    if (existing) {
      existing.amount += item.Claimed_Amount;
    } else {
      acc.push({
        type: item.Tax_Credit_Type,
        amount: item.Claimed_Amount
      });
    }
    return acc;
  }, [] as Array<{ type: string; amount: number; }>)
  .sort((a, b) => b.amount - a.amount)
  .slice(0, 7);

  // Aggregate data by state
  const stateData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.state === item.State);
    if (existing) {
      existing.amount += item.Claimed_Amount;
    } else {
      acc.push({
        state: item.State,
        amount: item.Claimed_Amount
      });
    }
    return acc;
  }, [] as Array<{ state: string; amount: number; }>)
  .sort((a, b) => b.amount - a.amount)
  .slice(0, 10);

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-slate-500">No data available for visualization</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Year-over-Year Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Credit Claims Over Time</CardTitle>
          <CardDescription>
            Total claimed amounts and number of claims by year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'totalAmount' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                  name === 'totalAmount' ? 'Total Amount' : 'Total Claims'
                ]}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="totalAmount" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Total Amount ($)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="totalClaims" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Total Claims"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showDetailed && (
        <>
          {/* Credit Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Claims by Credit Type</CardTitle>
              <CardDescription>
                Top credit types by total claimed amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={creditTypeData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={150} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* State Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Claims by State</CardTitle>
              <CardDescription>
                Top 10 states by total claimed amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={stateData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ state, percent }) => `${state} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {stateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

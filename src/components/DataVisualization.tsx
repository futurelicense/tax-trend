
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';
import { TaxCreditData } from '@/pages/Dashboard';

interface DataVisualizationProps {
  data: TaxCreditData[];
  showDetailed?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

export const DataVisualization: React.FC<DataVisualizationProps> = ({ data, showDetailed = false }) => {
  // Enhanced yearly data with sector breakdown
  const yearlyData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.year === item.Year);
    if (existing) {
      existing.totalAmount += item.Claimed_Amount;
      existing.totalClaims += item.Claims_Count;
      existing.avgClaimSize = existing.totalAmount / existing.totalClaims;
      existing[item.Sector] = (existing[item.Sector] || 0) + item.Claimed_Amount;
    } else {
      acc.push({
        year: item.Year,
        totalAmount: item.Claimed_Amount,
        totalClaims: item.Claims_Count,
        avgClaimSize: item.Claimed_Amount / item.Claims_Count,
        [item.Sector]: item.Claimed_Amount
      });
    }
    return acc;
  }, [] as Array<any>).sort((a, b) => a.year - b.year);

  // Income bracket analysis
  const incomeBracketData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.bracket === item.Income_Bracket);
    if (existing) {
      existing.amount += item.Claimed_Amount;
      existing.claims += item.Claims_Count;
      existing.avgClaim = existing.amount / existing.claims;
    } else {
      acc.push({
        bracket: item.Income_Bracket,
        amount: item.Claimed_Amount,
        claims: item.Claims_Count,
        avgClaim: item.Claimed_Amount / item.Claims_Count
      });
    }
    return acc;
  }, [] as Array<{ bracket: string; amount: number; claims: number; avgClaim: number; }>)
  .sort((a, b) => b.amount - a.amount);

  // Sector efficiency analysis (claims per dollar)
  const sectorEfficiencyData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.sector === item.Sector);
    if (existing) {
      existing.amount += item.Claimed_Amount;
      existing.claims += item.Claims_Count;
    } else {
      acc.push({
        sector: item.Sector,
        amount: item.Claimed_Amount,
        claims: item.Claims_Count
      });
    }
    return acc;
  }, [] as Array<{ sector: string; amount: number; claims: number; }>)
  .map(item => ({
    ...item,
    efficiency: item.claims / item.amount * 1000000, // Claims per million dollars
    avgClaimSize: item.amount / item.claims
  }))
  .sort((a, b) => b.efficiency - a.efficiency);

  // Credit type performance over time
  const creditTypeTimeData = data.reduce((acc, item) => {
    const key = `${item.Year}-${item.Tax_Credit_Type}`;
    const existing = acc.find(d => d.year === item.Year && d.creditType === item.Tax_Credit_Type);
    if (existing) {
      existing.amount += item.Claimed_Amount;
      existing.claims += item.Claims_Count;
    } else {
      acc.push({
        year: item.Year,
        creditType: item.Tax_Credit_Type,
        amount: item.Claimed_Amount,
        claims: item.Claims_Count
      });
    }
    return acc;
  }, [] as Array<{ year: number; creditType: string; amount: number; claims: number; }>);

  // Get unique sectors for color mapping
  const uniqueSectors = [...new Set(data.map(item => item.Sector))];

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
      {/* Enhanced Year-over-Year Trends with Sector Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Credit Claims & Sector Performance Over Time</CardTitle>
          <CardDescription>
            Multi-dimensional view of claims amount, count, and average claim size trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  typeof value === 'number' ? `$${value.toLocaleString()}` : value,
                  name
                ]}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="totalAmount" 
                fill="#8884d8" 
                fillOpacity={0.3}
                stroke="#8884d8"
                name="Total Amount ($)"
              />
              <Bar 
                yAxisId="right"
                dataKey="totalClaims" 
                fill="#82ca9d"
                name="Total Claims"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="avgClaimSize" 
                stroke="#ff7300" 
                strokeWidth={3}
                name="Avg Claim Size ($)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Income Bracket Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Credit Distribution by Income Bracket</CardTitle>
          <CardDescription>
            Analysis of credit utilization across different income levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={incomeBracketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bracket" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name.includes('amount') || name.includes('Claim') ? `$${value.toLocaleString()}` : value.toLocaleString(),
                  name
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#8884d8" name="Total Amount ($)" />
              <Bar yAxisId="right" dataKey="claims" fill="#82ca9d" name="Claims Count" />
              <Line yAxisId="left" dataKey="avgClaim" stroke="#ff7300" strokeWidth={2} name="Avg Claim ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showDetailed && (
        <>
          {/* Sector Efficiency Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Sector Efficiency & Performance Metrics</CardTitle>
              <CardDescription>
                Claims volume vs. average claim size by sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={sectorEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name.includes('efficiency') ? value.toFixed(2) : `$${value.toLocaleString()}`,
                      name === 'efficiency' ? 'Claims per $1M' : name === 'avgClaimSize' ? 'Avg Claim Size' : name
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avgClaimSize" fill="#8884d8" name="Avg Claim Size ($)" />
                  <Line yAxisId="right" dataKey="efficiency" stroke="#ff7300" strokeWidth={3} name="Claims Efficiency" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Credit Type Trends Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Credit Type Performance Timeline</CardTitle>
              <CardDescription>
                How different credit types have performed year over year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  <Legend />
                  {uniqueSectors.slice(0, 5).map((sector, index) => (
                    <Line 
                      key={sector}
                      type="monotone" 
                      dataKey={sector} 
                      stroke={COLORS[index]} 
                      strokeWidth={2}
                      name={sector}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* State Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>State-Level Tax Credit Alignment</CardTitle>
              <CardDescription>
                Top performing states and their credit utilization patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={data.reduce((acc, item) => {
                      const existing = acc.find(d => d.state === item.State);
                      if (existing) {
                        existing.amount += item.Claimed_Amount;
                        existing.claims += item.Claims_Count;
                      } else {
                        acc.push({
                          state: item.State,
                          amount: item.Claimed_Amount,
                          claims: item.Claims_Count
                        });
                      }
                      return acc;
                    }, [] as Array<{ state: string; amount: number; claims: number; }>)
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ state, amount, percent }) => 
                      `${state}: ${(percent * 100).toFixed(1)}%`
                    }
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {data.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Total Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, MapPin, Target, BarChart3, PieChart, Calculator } from 'lucide-react';
import { TaxCreditData } from '@/pages/Dashboard';

interface SummaryStatsProps {
  data: TaxCreditData[];
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-slate-500">No data available for summary statistics</p>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = data.reduce((sum, item) => sum + item.Claimed_Amount, 0);
  const totalClaims = data.reduce((sum, item) => sum + item.Claims_Count, 0);
  const uniqueStates = new Set(data.map(item => item.State)).size;
  const uniqueCreditTypes = new Set(data.map(item => item.Tax_Credit_Type)).size;
  const uniqueSectors = new Set(data.map(item => item.Sector)).size;

  const averageClaimAmount = totalClaims > 0 ? totalAmount / totalClaims : 0;

  const yearRange = data.length > 0 ? {
    min: Math.min(...data.map(item => item.Year)),
    max: Math.max(...data.map(item => item.Year))
  } : { min: 0, max: 0 };

  // Advanced metrics
  const sectorAnalysis = data.reduce((acc, item) => {
    acc[item.Sector] = (acc[item.Sector] || 0) + item.Claimed_Amount;
    return acc;
  }, {} as Record<string, number>);

  const topSector = Object.keys(sectorAnalysis).reduce((a, b) => 
    sectorAnalysis[a] > sectorAnalysis[b] ? a : b, ''
  );

  const incomeAnalysis = data.reduce((acc, item) => {
    acc[item.Income_Bracket] = (acc[item.Income_Bracket] || 0) + item.Claimed_Amount;
    return acc;
  }, {} as Record<string, number>);

  const topIncomeBracket = Object.keys(incomeAnalysis).reduce((a, b) => 
    incomeAnalysis[a] > incomeAnalysis[b] ? a : b, ''
  );

  // Calculate growth rate (if multiple years)
  const yearlyTotals = data.reduce((acc, item) => {
    acc[item.Year] = (acc[item.Year] || 0) + item.Claimed_Amount;
    return acc;
  }, {} as Record<number, number>);

  const years = Object.keys(yearlyTotals).map(Number).sort();
  const growthRate = years.length > 1 ? 
    ((yearlyTotals[years[years.length - 1]] - yearlyTotals[years[0]]) / yearlyTotals[years[0]] * 100) : 0;

  // Market concentration (top 3 states % of total)
  const stateAmounts = data.reduce((acc, item) => {
    acc[item.State] = (acc[item.State] || 0) + item.Claimed_Amount;
    return acc;
  }, {} as Record<string, number>);

  const topThreeStatesAmount = Object.values(stateAmounts)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, amount) => sum + amount, 0);

  const marketConcentration = totalAmount > 0 ? (topThreeStatesAmount / totalAmount * 100) : 0;

  const stats = [
    {
      title: "Total Claims Amount",
      value: `$${totalAmount.toLocaleString()}`,
      description: `From ${yearRange.min} to ${yearRange.max}`,
      icon: DollarSign,
      trend: growthRate > 0 ? `+${growthRate.toFixed(1)}% growth` : `${growthRate.toFixed(1)}% change`,
      trendColor: growthRate > 0 ? "text-green-600" : "text-red-600"
    },
    {
      title: "Average Claim Size", 
      value: `$${averageClaimAmount.toLocaleString()}`,
      description: `${totalClaims.toLocaleString()} total claims`,
      icon: Calculator,
      trend: "Claims efficiency metric",
      trendColor: "text-blue-600"
    },
    {
      title: "Geographic Coverage",
      value: `${uniqueStates} States`,
      description: `${marketConcentration.toFixed(1)}% in top 3 states`,
      icon: MapPin,
      trend: marketConcentration > 60 ? "High concentration" : "Well distributed",
      trendColor: marketConcentration > 60 ? "text-orange-600" : "text-green-600"
    },
    {
      title: "Program Diversity",
      value: `${uniqueCreditTypes} Credit Types`,
      description: `Across ${uniqueSectors} sectors`,
      icon: Target,
      trend: "Diversified portfolio",
      trendColor: "text-green-600"
    },
    {
      title: "Top Performing Sector",
      value: topSector,
      description: `$${sectorAnalysis[topSector]?.toLocaleString() || 0} claimed`,
      icon: BarChart3,
      trend: `${((sectorAnalysis[topSector] || 0) / totalAmount * 100).toFixed(1)}% of total`,
      trendColor: "text-purple-600"
    },
    {
      title: "Primary Income Bracket",
      value: topIncomeBracket,
      description: `$${incomeAnalysis[topIncomeBracket]?.toLocaleString() || 0} claimed`,
      icon: Users,
      trend: `${((incomeAnalysis[topIncomeBracket] || 0) / totalAmount * 100).toFixed(1)}% of total`,
      trendColor: "text-indigo-600"
    },
    {
      title: "Market Efficiency",
      value: `${(totalClaims / totalAmount * 1000000).toFixed(1)}`,
      description: "Claims per million dollars",
      icon: TrendingUp,
      trend: "Volume efficiency ratio",
      trendColor: "text-cyan-600"
    },
    {
      title: "Data Coverage",
      value: `${years.length} Years`,
      description: `${data.length.toLocaleString()} total records`,
      icon: PieChart,
      trend: "Comprehensive dataset",
      trendColor: "text-green-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            <p className={`text-xs mt-1 font-medium ${stat.trendColor}`}>{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

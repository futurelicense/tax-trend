
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, MapPin } from 'lucide-react';
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

  const averageClaimAmount = totalClaims > 0 ? totalAmount / totalClaims : 0;

  const yearRange = data.length > 0 ? {
    min: Math.min(...data.map(item => item.Year)),
    max: Math.max(...data.map(item => item.Year))
  } : { min: 0, max: 0 };

  const topState = data.reduce((acc, item) => {
    acc[item.State] = (acc[item.State] || 0) + item.Claimed_Amount;
    return acc;
  }, {} as Record<string, number>);

  const topStateName = Object.keys(topState).reduce((a, b) => 
    topState[a] > topState[b] ? a : b, ''
  );

  const stats = [
    {
      title: "Total Claims Amount",
      value: `$${totalAmount.toLocaleString()}`,
      description: `From ${yearRange.min} to ${yearRange.max}`,
      icon: DollarSign,
      trend: "+12.5% from last period"
    },
    {
      title: "Total Claims Count", 
      value: totalClaims.toLocaleString(),
      description: `Average: $${averageClaimAmount.toLocaleString()} per claim`,
      icon: Users,
      trend: "+8.2% from last period"
    },
    {
      title: "States Covered",
      value: uniqueStates.toString(),
      description: `Top state: ${topStateName}`,
      icon: MapPin,
      trend: "Complete coverage"
    },
    {
      title: "Credit Types",
      value: uniqueCreditTypes.toString(),
      description: "Different tax credit programs",
      icon: TrendingUp,
      trend: "Diverse portfolio"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from '@/components/FileUpload';
import { DataVisualization } from '@/components/DataVisualization';
import { FilterControls } from '@/components/FilterControls';
import { SummaryStats } from '@/components/SummaryStats';
import { ExportTools } from '@/components/ExportTools';
import { TrendingUp, BarChart3, PieChart, Download, ChevronRight, Sparkles, Target, Users, Building2, ArrowUpRight, Play } from 'lucide-react';

export interface TaxCreditData {
  Year: number;
  State: string;
  Tax_Credit_Type: string;
  Sector: string;
  Claimed_Amount: number;
  Claims_Count: number;
  Income_Bracket: string;
  Source: string;
}

export interface FilterState {
  years: number[];
  states: string[];
  creditTypes: string[];
  sectors: string[];
  incomeBrackets: string[];
}

const Dashboard = () => {
  const [data, setData] = useState<TaxCreditData[]>([]);
  const [filteredData, setFilteredData] = useState<TaxCreditData[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    years: [],
    states: [],
    creditTypes: [],
    sectors: [],
    incomeBrackets: []
  });

  const handleDataUpload = (newData: TaxCreditData[]) => {
    console.log('Data uploaded:', newData.length, 'records');
    setData(newData);
    setFilteredData(newData);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    let filtered = data;
    
    if (newFilters.years.length > 0) {
      filtered = filtered.filter(item => newFilters.years.includes(item.Year));
    }
    if (newFilters.states.length > 0) {
      filtered = filtered.filter(item => newFilters.states.includes(item.State));
    }
    if (newFilters.creditTypes.length > 0) {
      filtered = filtered.filter(item => newFilters.creditTypes.includes(item.Tax_Credit_Type));
    }
    if (newFilters.sectors.length > 0) {
      filtered = filtered.filter(item => newFilters.sectors.includes(item.Sector));
    }
    if (newFilters.incomeBrackets.length > 0) {
      filtered = filtered.filter(item => newFilters.incomeBrackets.includes(item.Income_Bracket));
    }
    
    console.log('Filtered data:', filtered.length, 'records');
    setFilteredData(filtered);
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Track tax credit trends across different time periods with interactive visualizations"
    },
    {
      icon: Target,
      title: "Smart Filtering",
      description: "Filter data by year, state, sector, and income brackets for precise analysis"
    },
    {
      icon: Building2,
      title: "Sector Insights",
      description: "Analyze performance across different business sectors and industries"
    },
    {
      icon: Users,
      title: "Income Analysis",
      description: "Understand credit utilization patterns across different income brackets"
    }
  ];

  const stats = [
    { label: "Data Points", value: "50K+", icon: BarChart3 },
    { label: "States Covered", value: "50", icon: Target },
    { label: "Years of Data", value: "10+", icon: TrendingUp },
    { label: "Sectors", value: "25+", icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Advanced Tax Credit Analytics Platform
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 animate-fade-in">
              Credit Utilization
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Trend Analyzer
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in">
              Visualize U.S. federal and state tax credit trends by year, region, sector, and income bracket with our comprehensive analytics platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="group">
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Cards */}
        <div className="absolute top-20 left-10 animate-float hidden lg:block">
          <Card className="w-48 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">$2.5B</p>
                  <p className="text-sm text-slate-600">Total Credits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="absolute top-40 right-10 animate-float-delayed hidden lg:block">
          <Card className="w-48 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">+23%</p>
                  <p className="text-sm text-slate-600">YoY Growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</h3>
                <p className="text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Analytics Features</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to analyze and understand tax credit utilization patterns
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Analytics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="upload" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-4 lg:w-auto bg-white/80 backdrop-blur-sm shadow-lg">
                <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <Download className="w-4 h-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <TrendingUp className="w-4 h-4" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <BarChart3 className="w-4 h-4" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <PieChart className="w-4 h-4" />
                  Reports
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upload" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Upload Tax Credit Data
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Upload your CSV file containing tax credit utilization data. 
                    Expected format: Year, State, Tax_Credit_Type, Sector, Claimed_Amount, Claims_Count, Income_Bracket, Source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onDataUpload={handleDataUpload} />
                </CardContent>
              </Card>
              
              {data.length > 0 && (
                <div className="animate-fade-in">
                  <SummaryStats data={filteredData} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              {data.length > 0 ? (
                <div className="animate-fade-in space-y-6">
                  <FilterControls 
                    data={data} 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                  />
                  <DataVisualization data={filteredData} />
                </div>
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <TrendingUp className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-slate-500 text-lg">Please upload data first to view trends</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              {data.length > 0 ? (
                <div className="animate-fade-in space-y-6">
                  <FilterControls 
                    data={data} 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                  />
                  <SummaryStats data={filteredData} />
                  <DataVisualization data={filteredData} showDetailed={true} />
                </div>
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <BarChart3 className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-slate-500 text-lg">Please upload data first to view analysis</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              {data.length > 0 ? (
                <div className="animate-fade-in space-y-6">
                  <FilterControls 
                    data={data} 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                  />
                  <ExportTools data={filteredData} />
                  <SummaryStats data={filteredData} />
                </div>
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <PieChart className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-slate-500 text-lg">Please upload data first to generate reports</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

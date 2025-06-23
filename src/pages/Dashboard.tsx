
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from '@/components/FileUpload';
import { DataVisualization } from '@/components/DataVisualization';
import { FilterControls } from '@/components/FilterControls';
import { SummaryStats } from '@/components/SummaryStats';
import { ExportTools } from '@/components/ExportTools';
import { TrendingUp, BarChart3, PieChart, Download } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <TrendingUp className="text-blue-600" />
            Credit Utilization Trend Analyzer
          </h1>
          <p className="text-lg text-slate-600">
            Visualize U.S. federal and state tax credit trends by year, region, sector, and income bracket
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Tax Credit Data</CardTitle>
                <CardDescription>
                  Upload your CSV file containing tax credit utilization data. 
                  Expected format: Year, State, Tax_Credit_Type, Sector, Claimed_Amount, Claims_Count, Income_Bracket, Source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onDataUpload={handleDataUpload} />
              </CardContent>
            </Card>
            
            {data.length > 0 && (
              <SummaryStats data={filteredData} />
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {data.length > 0 ? (
              <>
                <FilterControls 
                  data={data} 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                />
                <DataVisualization data={filteredData} />
              </>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-slate-500">Please upload data first to view trends</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {data.length > 0 ? (
              <>
                <FilterControls 
                  data={data} 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                />
                <SummaryStats data={filteredData} />
                <DataVisualization data={filteredData} showDetailed={true} />
              </>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-slate-500">Please upload data first to view analysis</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {data.length > 0 ? (
              <>
                <FilterControls 
                  data={data} 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                />
                <ExportTools data={filteredData} />
                <SummaryStats data={filteredData} />
              </>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-slate-500">Please upload data first to generate reports</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

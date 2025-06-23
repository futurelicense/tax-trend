
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from 'lucide-react';
import { TaxCreditData, FilterState } from '@/pages/Dashboard';

interface FilterControlsProps {
  data: TaxCreditData[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ data, filters, onFilterChange }) => {
  const uniqueYears = [...new Set(data.map(item => item.Year))].sort((a, b) => b - a);
  const uniqueStates = [...new Set(data.map(item => item.State))].sort();
  const uniqueCreditTypes = [...new Set(data.map(item => item.Tax_Credit_Type))].sort();
  const uniqueSectors = [...new Set(data.map(item => item.Sector))].sort();
  const uniqueIncomeBrackets = [...new Set(data.map(item => item.Income_Bracket))].sort();

  const addFilter = (category: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters };
    const categoryArray = newFilters[category] as (string | number)[];
    
    if (!categoryArray.includes(value)) {
      categoryArray.push(value);
      onFilterChange(newFilters);
    }
  };

  const removeFilter = (category: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters };
    const categoryArray = newFilters[category] as (string | number)[];
    
    const index = categoryArray.indexOf(value);
    if (index > -1) {
      categoryArray.splice(index, 1);
      onFilterChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    onFilterChange({
      years: [],
      states: [],
      creditTypes: [],
      sectors: [],
      incomeBrackets: []
    });
  };

  const totalActiveFilters = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
          {totalActiveFilters > 0 && (
            <Badge variant="secondary">{totalActiveFilters} active</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Year</label>
            <Select onValueChange={(value) => addFilter('years', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">State</label>
            <Select onValueChange={(value) => addFilter('states', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {uniqueStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Credit Type</label>
            <Select onValueChange={(value) => addFilter('creditTypes', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCreditTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Sector</label>
            <Select onValueChange={(value) => addFilter('sectors', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {uniqueSectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Income Bracket</label>
            <Select onValueChange={(value) => addFilter('incomeBrackets', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select bracket" />
              </SelectTrigger>
              <SelectContent>
                {uniqueIncomeBrackets.map(bracket => (
                  <SelectItem key={bracket} value={bracket}>{bracket}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {totalActiveFilters > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Active Filters:</h4>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filters.years.map(year => (
                <Badge key={`year-${year}`} variant="secondary" className="flex items-center gap-1">
                  Year: {year}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeFilter('years', year)}
                  />
                </Badge>
              ))}
              
              {filters.states.map(state => (
                <Badge key={`state-${state}`} variant="secondary" className="flex items-center gap-1">
                  {state}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeFilter('states', state)}
                  />
                </Badge>
              ))}
              
              {filters.creditTypes.map(type => (
                <Badge key={`type-${type}`} variant="secondary" className="flex items-center gap-1">
                  {type}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeFilter('creditTypes', type)}
                  />
                </Badge>
              ))}
              
              {filters.sectors.map(sector => (
                <Badge key={`sector-${sector}`} variant="secondary" className="flex items-center gap-1">
                  {sector}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeFilter('sectors', sector)}
                  />
                </Badge>
              ))}
              
              {filters.incomeBrackets.map(bracket => (
                <Badge key={`bracket-${bracket}`} variant="secondary" className="flex items-center gap-1">
                  {bracket}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeFilter('incomeBrackets', bracket)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

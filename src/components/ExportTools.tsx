
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Table } from 'lucide-react';
import { TaxCreditData } from '@/pages/Dashboard';
import { useToast } from "@/hooks/use-toast";

interface ExportToolsProps {
  data: TaxCreditData[];
}

export const ExportTools: React.FC<ExportToolsProps> = ({ data }) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (data.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please upload data first before exporting",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tax_credit_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${data.length} records to CSV`,
    });
  };

  const exportSummaryReport = () => {
    if (data.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please upload data first before exporting",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = data.reduce((sum, item) => sum + item.Claimed_Amount, 0);
    const totalClaims = data.reduce((sum, item) => sum + item.Claims_Count, 0);
    const uniqueStates = new Set(data.map(item => item.State)).size;
    const uniqueCreditTypes = new Set(data.map(item => item.Tax_Credit_Type)).size;

    const yearRange = {
      min: Math.min(...data.map(item => item.Year)),
      max: Math.max(...data.map(item => item.Year))
    };

    // Top states by amount
    const stateAmounts = data.reduce((acc, item) => {
      acc[item.State] = (acc[item.State] || 0) + item.Claimed_Amount;
      return acc;
    }, {} as Record<string, number>);

    const topStates = Object.entries(stateAmounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Top credit types by amount
    const creditAmounts = data.reduce((acc, item) => {
      acc[item.Tax_Credit_Type] = (acc[item.Tax_Credit_Type] || 0) + item.Claimed_Amount;
      return acc;
    }, {} as Record<string, number>);

    const topCredits = Object.entries(creditAmounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const reportContent = `
TAX CREDIT UTILIZATION SUMMARY REPORT
Generated: ${new Date().toLocaleDateString()}

OVERVIEW
========
Data Period: ${yearRange.min} - ${yearRange.max}
Total Claims Amount: $${totalAmount.toLocaleString()}
Total Claims Count: ${totalClaims.toLocaleString()}
Average Claim Amount: $${(totalAmount / totalClaims).toLocaleString()}
States Covered: ${uniqueStates}
Credit Types: ${uniqueCreditTypes}

TOP 5 STATES BY AMOUNT
=====================
${topStates.map(([state, amount], i) => 
  `${i + 1}. ${state}: $${amount.toLocaleString()}`
).join('\n')}

TOP 5 CREDIT TYPES BY AMOUNT
===========================
${topCredits.map(([type, amount], i) => 
  `${i + 1}. ${type}: $${amount.toLocaleString()}`
).join('\n')}

YEAR-BY-YEAR BREAKDOWN
=====================
${Array.from(new Set(data.map(item => item.Year)))
  .sort()
  .map(year => {
    const yearData = data.filter(item => item.Year === year);
    const yearAmount = yearData.reduce((sum, item) => sum + item.Claimed_Amount, 0);
    const yearClaims = yearData.reduce((sum, item) => sum + item.Claims_Count, 0);
    return `${year}: $${yearAmount.toLocaleString()} (${yearClaims.toLocaleString()} claims)`;
  }).join('\n')}
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tax_credit_summary_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Exported",
      description: "Summary report has been downloaded",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data & Reports</CardTitle>
        <CardDescription>
          Download your filtered data and generate summary reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Button 
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center gap-2"
            disabled={data.length === 0}
          >
            <Table className="w-4 h-4" />
            Export Filtered Data (CSV)
          </Button>
          
          <Button 
            onClick={exportSummaryReport}
            variant="outline"
            className="flex items-center gap-2"
            disabled={data.length === 0}
          >
            <FileText className="w-4 h-4" />
            Generate Summary Report
          </Button>
        </div>
        
        <div className="text-sm text-slate-600">
          <p className="mb-2">Export options:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>CSV Export:</strong> Downloads filtered data in spreadsheet format</li>
            <li><strong>Summary Report:</strong> Generates a comprehensive text report with key insights</li>
          </ul>
          {data.length > 0 && (
            <p className="mt-2 text-green-600">
              Ready to export {data.length} records
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

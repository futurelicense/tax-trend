
import React, { useCallback, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { TaxCreditData } from '@/pages/Dashboard';
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onDataUpload: (data: TaxCreditData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const parseCSV = (csvText: string): TaxCreditData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    console.log('CSV Headers:', headers);
    
    const data: TaxCreditData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length >= 8) {
        const record: TaxCreditData = {
          Year: parseInt(values[0]) || 0,
          State: values[1] || '',
          Tax_Credit_Type: values[2] || '',
          Sector: values[3] || '',
          Claimed_Amount: parseFloat(values[4]) || 0,
          Claims_Count: parseInt(values[5]) || 0,
          Income_Bracket: values[6] || '',
          Source: values[7] || ''
        };
        data.push(record);
      }
    }
    
    return data;
  };

  const handleFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadStatus('idle');
    
    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      
      if (parsedData.length === 0) {
        throw new Error('No valid data found in CSV file');
      }
      
      onDataUpload(parsedData);
      setUploadStatus('success');
      toast({
        title: "Upload Successful",
        description: `Loaded ${parsedData.length} records from ${file.name}`,
      });
    } catch (error) {
      console.error('Error parsing CSV:', error);
      setUploadStatus('error');
      toast({
        title: "Upload Failed",
        description: "Please check your CSV format and try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onDataUpload, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      handleFile(csvFile);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  }, [handleFile, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <Card 
      className={`border-2 border-dashed transition-all duration-200 ${
        isDragOver 
          ? 'border-blue-400 bg-blue-50' 
          : uploadStatus === 'success'
          ? 'border-green-400 bg-green-50'
          : uploadStatus === 'error'
          ? 'border-red-400 bg-red-50'
          : 'border-slate-300 hover:border-blue-300'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
    >
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        {isProcessing ? (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        ) : uploadStatus === 'success' ? (
          <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
        ) : uploadStatus === 'error' ? (
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        ) : (
          <Upload className="w-12 h-12 text-slate-400 mb-4" />
        )}
        
        <h3 className="text-lg font-semibold mb-2">
          {isProcessing 
            ? 'Processing CSV...' 
            : uploadStatus === 'success'
            ? 'Upload Successful!'
            : uploadStatus === 'error'
            ? 'Upload Failed'
            : 'Upload Tax Credit Data'
          }
        </h3>
        
        <p className="text-slate-600 mb-6">
          {uploadStatus === 'idle' 
            ? 'Drag and drop your CSV file here, or click to select'
            : uploadStatus === 'success'
            ? 'Your data has been loaded successfully'
            : 'Please check your file format and try again'
          }
        </p>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-input')?.click()}
            disabled={isProcessing}
            className="relative"
          >
            <FileText className="w-4 h-4 mr-2" />
            Choose File
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-slate-500">
          <p className="font-medium mb-2">Expected CSV format:</p>
          <code className="bg-slate-100 px-2 py-1 rounded text-xs">
            Year, State, Tax_Credit_Type, Sector, Claimed_Amount, Claims_Count, Income_Bracket, Source
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

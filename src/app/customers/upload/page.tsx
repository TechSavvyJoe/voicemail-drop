'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdvancedNavigation } from '@/components/advanced-navigation';
import Link from 'next/link';

interface Customer {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  vehicleInterest?: string;
  lastContact?: string;
}

export default function CustomerUpload() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const processFile = async (file: File) => {
    setUploadStatus('processing');
    setErrorMessage('');
    setValidationErrors([]);

    try {
      const text = await file.text();
      const parsedData: Record<string, string>[] = [];

      if (file.name.endsWith('.csv')) {
        // Simple CSV parsing (in production, use a proper CSV parser)
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',');
            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
              row[header] = values[index]?.trim() || '';
            });
            parsedData.push(row);
          }
        }
      } else {
        setErrorMessage('Unsupported file format. Please use CSV format.');
        setUploadStatus('error');
        return;
      }

      // Validate and transform data
      const processedCustomers: Customer[] = [];
      const errors: string[] = [];

      parsedData.forEach((row, index) => {
        const customer: Customer = {
          firstName: row.firstname || row['first name'] || row.first || '',
          lastName: row.lastname || row['last name'] || row.last || '',
          phoneNumber: row.phone || row.phonenumber || row['phone number'] || row.mobile || '',
          email: row.email || '',
          vehicleInterest: row.vehicle || row.interest || row['vehicle interest'] || '',
          lastContact: row.lastcontact || row['last contact'] || ''
        };

        // Validate required fields
        if (!customer.firstName) {
          errors.push(`Row ${index + 2}: First name is required`);
        }
        if (!customer.lastName) {
          errors.push(`Row ${index + 2}: Last name is required`);
        }
        if (!customer.phoneNumber) {
          errors.push(`Row ${index + 2}: Phone number is required`);
        } else {
          // Basic phone number validation
          const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
          if (!phoneRegex.test(customer.phoneNumber)) {
            errors.push(`Row ${index + 2}: Invalid phone number format`);
          }
        }

        if (errors.length === 0 || errors.filter(e => e.includes(`Row ${index + 2}`)).length === 0) {
          processedCustomers.push(customer);
        }
      });

      if (errors.length > 0) {
        setValidationErrors(errors);
        setUploadStatus('error');
      } else {
        setCustomers(processedCustomers);
        setUploadStatus('success');
      }
    } catch {
      setErrorMessage('Failed to process file. Please check the format and try again.');
      setUploadStatus('error');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AdvancedNavigation />

      <div className="p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 mb-8 shadow-xl"
        >
          <div className="flex items-center gap-6">
            <Link href="/customers">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/80 hover:bg-white/90 border-gray-200/50 backdrop-blur-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Customers
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                Upload Customer List
              </h1>
              <p className="text-gray-600 font-medium">Import customer data from CSV or Excel files</p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
        {/* Upload Section */}
        {uploadStatus === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Upload Customer Data
              </h2>
              <p className="text-gray-600 font-medium text-lg">
                Upload a CSV or Excel file containing your customer information
              </p>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className={`h-16 w-16 mx-auto mb-6 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {isDragActive ? (
                <p className="text-blue-700 text-xl font-bold">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-gray-700 mb-3 text-lg font-medium">
                    Drag and drop your file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    Supports CSV and Excel files (up to 10MB)
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 backdrop-blur-sm bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200/50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Required Columns:</h3>
                  <ul className="text-sm text-gray-700 space-y-2 font-medium">
                    <li>• First Name</li>
                    <li>• Last Name</li>
                    <li>• Phone Number</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Optional Columns:</h3>
                  <ul className="text-sm text-gray-700 space-y-2 font-medium">
                    <li>• Email</li>
                    <li>• Vehicle Interest</li>
                    <li>• Last Contact Date</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Processing State */}
        {uploadStatus === 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Processing File...
            </h2>
            <p className="text-gray-600 font-medium">
              Please wait while we validate and import your customer data
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {uploadStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg mr-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Upload Error
              </h2>
            </div>
            
            {errorMessage && (
              <div className="backdrop-blur-sm bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-200/50 rounded-xl p-6 mb-6">
                <p className="text-red-800 font-medium">{errorMessage}</p>
              </div>
            )}

            {validationErrors.length > 0 && (
              <div className="backdrop-blur-sm bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-200/50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-red-800 mb-3 text-lg">Validation Errors:</h3>
                <ul className="text-red-700 text-sm space-y-2 font-medium">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={() => {
                setUploadStatus('idle');
                setErrorMessage('');
                setValidationErrors([]);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 font-bold"
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Success State */}
        {uploadStatus === 'success' && customers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl"
          >
            <div className="p-8 border-b border-white/50">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg mr-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Upload Successful
                </h2>
              </div>
              <p className="text-gray-600 font-medium text-lg">
                Successfully imported {customers.length} customers
              </p>
            </div>

            <div className="p-8">
              <div className="overflow-x-auto backdrop-blur-sm bg-white/50 rounded-xl border border-gray-200/50">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Vehicle Interest
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/30 divide-y divide-gray-200/50">
                    {customers.slice(0, 10).map((customer, index) => (
                      <tr key={index} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                          {customer.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                          {customer.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                          {customer.vehicleInterest || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {customers.length > 10 && (
                <p className="text-sm text-gray-600 font-medium mt-6 text-center">
                  Showing first 10 customers. Total: {customers.length}
                </p>
              )}
            </div>

            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-2xl flex justify-between items-center border-t border-white/50">
              <Button
                variant="ghost"
                onClick={() => {
                  setUploadStatus('idle');
                  setCustomers([]);
                }}
                className="text-gray-600 hover:text-gray-800 bg-white/70 hover:bg-white/90"
              >
                Upload Another File
              </Button>
              <Link href="/campaigns/new">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 font-bold">
                  Create Campaign
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}

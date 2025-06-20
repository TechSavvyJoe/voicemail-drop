'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface FileUploadProps {
  accept?: string
  maxSize?: number
  multiple?: boolean
  onFilesSelected?: (files: File[]) => void
  onError?: (error: string) => void
  className?: string
}

interface UploadedFile {
  file: File
  id: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export function FileUpload({ 
  accept = '.csv', 
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  onFilesSelected,
  onError,
  className = ''
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const processFiles = useCallback((files: File[]) => {
    const validFiles: File[] = []
    const errors: string[] = []

    files.forEach(file => {
      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`)
        return
      }

      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (accept && !accept.split(',').some(type => type.trim() === fileExtension)) {
        errors.push(`${file.name} has an unsupported file type`)
        return
      }

      validFiles.push(file)
    })

    if (errors.length > 0) {
      onError?.(errors.join(', '))
      return
    }

    if (!multiple && validFiles.length > 1) {
      onError?.('Only one file can be uploaded at a time')
      return
    }

    // Add files to upload queue
    const newUploads: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0
    }))

    setUploadedFiles(prev => [...prev, ...newUploads])

    // Simulate upload progress
    newUploads.forEach(upload => {
      simulateUpload(upload.id)
    })

    onFilesSelected?.(validFiles)
  }, [accept, maxSize, multiple, onFilesSelected, onError])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }, [processFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
  }, [processFiles])

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 30, 100)
          
          if (newProgress >= 100) {
            clearInterval(interval)
            return {
              ...file,
              progress: 100,
              status: Math.random() > 0.1 ? 'success' : 'error', // 90% success rate
              error: Math.random() > 0.1 ? undefined : 'Upload failed - please try again'
            }
          }
          
          return { ...file, progress: newProgress }
        }
        return file
      }))
    }, 200)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            Upload Customer List
          </CardTitle>
          <CardDescription>
            Upload a CSV or Excel file containing your customer data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="space-y-4">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isDragOver ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <Upload className="h-6 w-6" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isDragOver ? 'Drop files here' : 'Drag & drop your file here'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  or click to browse and select files
                </p>
                
                <input
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    Choose Files
                  </Button>
                </label>
              </div>
              
              <div className="text-xs text-gray-500">
                Supported formats: CSV, Excel • Max size: {Math.round(maxSize / 1024 / 1024)}MB
              </div>
            </div>
          </div>

          {/* Sample File Download */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Need a template?</h4>
                <p className="text-xs text-gray-600">Download our sample CSV file to see the required format</p>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Sample CSV
              </Button>
            </div>
          </div>

          {/* Uploaded Files List */}
          <AnimatePresence>
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 space-y-3"
              >
                <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-between p-3 border rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        file.status === 'success' ? 'bg-green-100' :
                        file.status === 'error' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {file.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : file.status === 'error' ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.file.size)}
                          </p>
                          <Badge variant={
                            file.status === 'success' ? 'default' :
                            file.status === 'error' ? 'destructive' : 'secondary'
                          } className="text-xs">
                            {file.status === 'uploading' ? `${Math.round(file.progress)}%` : file.status}
                          </Badge>
                        </div>
                        
                        {file.status === 'uploading' && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <motion.div
                              className="bg-blue-600 h-1.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${file.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        )}
                        
                        {file.error && (
                          <p className="text-xs text-red-600 mt-1">{file.error}</p>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

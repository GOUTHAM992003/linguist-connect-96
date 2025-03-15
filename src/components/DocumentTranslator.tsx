import React, { useState, useRef } from 'react';
import { FileInput, Upload, FileCheck2, AlertCircle, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supportedFileTypes, isFileSupported, estimateWordCount } from '@/lib/languageUtils';

interface DocumentTranslatorProps {
  sourceLanguage: string;
  targetLanguage: string;
  onTranslate: (file: File) => Promise<string | null>;
  disabled?: boolean;
}

const DocumentTranslator: React.FC<DocumentTranslatorProps> = ({
  sourceLanguage,
  targetLanguage,
  onTranslate,
  disabled = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setError(null);
    setDownloadUrl(null);
    
    if (selectedFile) {
      if (isFileSupported(selectedFile)) {
        setFile(selectedFile);
      } else {
        setFile(null);
        setError(`Unsupported file type. Please upload: ${supportedFileTypes.map(t => t.extension).join(', ')}`);
      }
    } else {
      setFile(null);
    }
  };
  
  const handleUpload = async () => {
    if (!file || disabled) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setDownloadUrl(null);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 90 ? 90 : newProgress; // Cap at 90% until translation completes
      });
    }, 300);
    
    try {
      const url = await onTranslate(file);
      setUploadProgress(100);
      
      if (url) {
        setDownloadUrl(url);
      }
    } catch (err) {
      setError("Failed to translate document. Please try again.");
      console.error(err);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setError(null);
    setDownloadUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-medium mb-4">Document Translation</h3>
      
      <div className="space-y-4">
        {/* File input area */}
        <div 
          className={`
            border-2 border-dashed rounded-lg p-6 text-center 
            ${error ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-700'} 
            ${!file && !error ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer' : ''}
          `}
          onClick={() => !file && !isUploading && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={supportedFileTypes.map(t => `.${t.extension}`).join(',')}
            disabled={isUploading || disabled}
          />
          
          {!file && !error && (
            <div className="flex flex-col items-center">
              <FileCheck2 className="h-10 w-10 text-green-500 mb-2" />
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {(file.size / 1024).toFixed(1)} KB • ~{estimateWordCount(file.size)} words
              </p>
            </div>
          )}
          
          {error && (
            <div className="flex flex-col items-center">
              <FileX className="h-10 w-10 text-red-500 mb-2" />
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={(e) => {
                  e.stopPropagation();
                  resetForm();
                }}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Uploading and translating...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-between items-center">
          <div>
            {file && !isUploading && !downloadUrl && (
              <p className="text-xs text-gray-500">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Translation may take a few minutes for large documents
              </p>
            )}
          </div>
          
          <div className="space-x-2">
            {file && !isUploading && !downloadUrl && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  disabled={disabled}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading || !file || disabled}
                >
                  Translate Document
                </Button>
              </>
            )}
            
            {downloadUrl && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                >
                  Translate Another
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.open(downloadUrl, '_blank', 'noopener,noreferrer')}
                >
                  Download Translated Document
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTranslator;

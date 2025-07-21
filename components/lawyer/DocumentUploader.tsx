"use client";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentUploaderProps {
  id: string;
  label: string;
  file: File | null;
  onFileChange: (file: File) => void;
  onFileRemove?: () => void;
  disabled?: boolean;
  isUploading?: boolean;
  required?: boolean;
  accept?: string;
  helpText?: string;
}

export function DocumentUploader({
  id,
  label,
  file,
  onFileChange,
  onFileRemove,
  disabled = false,
  isUploading = false,
  required = false,
  accept = "image/*,.pdf",
  helpText,
}: DocumentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (onFileRemove) {
      onFileRemove();
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    return <FileText className="h-8 w-8 text-primary stroke-1" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {file ? (
        <Card className="border-2 border-dashed border-quaternary bg-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {getFileIcon(file.name)}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {isUploading ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-green-600"></div>
                    Subiendo...
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={disabled}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
          <CardContent className="p-6">
            <div 
              className="flex flex-col items-center justify-center text-center cursor-pointer"
              onClick={triggerFileInput}
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Haz clic para subir un archivo
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF hasta 10MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {helpText && (
        <p className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}

      <Input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
    </div>
  );
}
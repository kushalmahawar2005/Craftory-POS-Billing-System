'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  currentImage?: string;
  onUpload: (url: string, publicId: string) => void;
  onDelete?: () => void;
  className?: string;
}

export default function ImageUpload({ currentImage, onUpload, onDelete, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Client-side validation
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large (max 5MB)');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG and WEBP allowed');
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUpload(data.url, data.publicId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        onClick={!isUploading && !currentImage ? handleClick : undefined}
        onDragOver={(e) => e.preventDefault()}
        onDrop={!isUploading && !currentImage ? handleDrop : undefined}
        className={`
          relative h-48 w-full rounded-2xl border-2 border-dashed transition-all overflow-hidden
          ${currentImage ? 'border-border' : 'border-border hover:border-primary hover:bg-primary/5 cursor-pointer'}
          ${error ? 'border-error bg-error/5' : ''}
          flex flex-col items-center justify-center gap-2
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs font-bold text-text-muted animate-pulse">Uploading Image...</p>
          </div>
        ) : currentImage ? (
          <div className="relative w-full h-full group">
            <img
              src={currentImage}
              alt="Product"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <button
                onClick={handleClick}
                className="px-4 py-2 bg-white text-text-primary text-[10px] font-black rounded-lg hover:bg-primary hover:text-white transition-all transform -translate-y-2 group-hover:translate-y-0"
              >
                CHANGE IMAGE
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                className="flex items-center gap-1.5 text-white text-[10px] font-black hover:text-error transition-colors"
              >
                <X className="w-3.5 h-3.5" /> REMOVE
              </button>
            </div>
            {/* Top Right Quick Remove for mobile/indicator */}
            <button
               onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
               className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-error shadow-sm md:hidden"
            >
               <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-page-bg rounded-xl flex items-center justify-center text-text-muted">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-text-primary">Click or drop image</p>
              <p className="text-[10px] text-text-muted font-bold mt-0.5">JPG, PNG, WEBP up to 5MB</p>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-2.5 bg-error/5 border border-error/20 rounded-xl text-[11px] font-bold text-error"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

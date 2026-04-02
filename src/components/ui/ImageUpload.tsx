'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  currentImage?: string;
  onUpload: (url: string, publicId: string) => void;
  onDelete?: () => void;
  className?: string;
  width?: string;
  height?: string;
}

export default function ImageUpload({ currentImage, onUpload, onDelete, className, width = 'w-32', height = 'h-32' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File too large (max 5MB)'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Only JPG, PNG and WEBP allowed'); return; }

    setError(null);
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onUpload(data.url, data.publicId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleUpload(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className={`inline-block group ${className}`}>
      <div
        onClick={!isUploading ? handleClick : undefined}
        onDragOver={(e) => e.preventDefault()}
        onDrop={!isUploading && !currentImage ? handleDrop : undefined}
        className={`
          relative ${width} ${height} rounded-lg border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center bg-gray-50
          ${currentImage ? 'border-transparent' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'}
          ${error ? 'border-red-300 bg-red-50' : ''}
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
          <div className="flex flex-col items-center">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          </div>
        ) : currentImage ? (
          <div className="relative w-full h-full group/img">
            <img src={currentImage} alt="Product" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <button onClick={handleClick} className="p-1.5 bg-white rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition-all">
                  <Upload className="w-3.5 h-3.5" />
               </button>
               <button onClick={(e) => { e.stopPropagation(); onDelete?.(); }} className="p-1.5 bg-white rounded-md text-red-600 hover:bg-red-600 hover:text-white transition-all">
                  <X className="w-3.5 h-3.5" />
               </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors shadow-sm">
               <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-blue-600 uppercase tracking-tighter">Add Image</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mt-2 text-[9px] font-bold text-red-500 whitespace-nowrap bg-red-50 px-2 py-1 rounded border border-red-100 uppercase tracking-tighter">
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

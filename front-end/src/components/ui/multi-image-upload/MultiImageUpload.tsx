"use client";
import React, { useState, useRef } from "react";
import { Label } from "../label";

interface MultiImageUploadProps {
  images?: File[];
  onChange?: (images: File[]) => void;
  label?: string;
  maxImages?: number;
  className?: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images: initialImages = [],
  onChange,
  label,
  maxImages = 10,
  className = "",
}) => {
  const [images, setImages] = useState<File[]>(initialImages);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    
    // Filter valid image files
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    
    if (images.length + validFiles.length > maxImages) {
      alert(`Vous ne pouvez pas télécharger plus de ${maxImages} images.`);
      return;
    }

    const newImages = [...images, ...validFiles];
    setImages(newImages);
    
    // Create previews for new images
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (onChange) {
      onChange(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setPreviews(newPreviews);
    
    if (onChange) {
      onChange(newImages);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    
    if (images.length + validFiles.length > maxImages) {
      alert(`Vous ne pouvez pas télécharger plus de ${maxImages} images.`);
      return;
    }

    const newImages = [...images, ...validFiles];
    setImages(newImages);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (onChange) {
      onChange(newImages);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      {/* Upload Area */}
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-500 transition-colors cursor-pointer dark:border-gray-700 dark:hover:border-brand-500"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 dark:bg-gray-800">
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Glissez-déposez vos images ici ou cliquez pour sélectionner
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            PNG, JPG, WEBP jusqu'à {maxImages} images
          </p>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={previews[index]}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {image.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {images.length} image{images.length > 1 ? 's' : ''} sélectionnée{images.length > 1 ? 's' : ''} 
          {maxImages && ` (max ${maxImages})`}
        </p>
      )}
    </div>
  );
};

export default MultiImageUpload; 
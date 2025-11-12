
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  title: string;
  description: string;
  imageUrl?: string | null;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, title, description, imageUrl, disabled = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onClick={!disabled ? handleClick : undefined}
      className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300
      ${disabled ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed opacity-50' : 'border-gray-600 hover:border-purple-500 hover:bg-gray-800/50'}`}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={disabled}
      />
      {imageUrl ? (
        <img src={imageUrl} alt="Preview" className="mx-auto max-h-60 rounded-md object-contain" />
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 text-gray-500 mb-3">
            <UploadIcon />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      )}
    </div>
  );
};
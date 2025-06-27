import React, { FC, useRef, useState } from "react";

interface FileInputProps {
  className?: string;
  name?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: FC<FileInputProps> = ({ className, onChange, name, placeholder }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
    onChange?.(e);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors hover:bg-gray-50 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:hover:bg-gray-800 ${className}`}
      >
        <span className={fileName ? "text-gray-700 dark:text-white" : "text-gray-400"}>
          {fileName || placeholder || "Sélectionnez un fichier"}
        </span>
      </button>
    </div>
  );
};

export default FileInput;

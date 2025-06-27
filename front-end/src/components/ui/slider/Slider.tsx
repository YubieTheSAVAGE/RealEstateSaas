"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../label";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value: initialValue = 0,
  onChange,
  label,
  showValue = true,
  className = "",
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider dark:bg-gray-700"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
        {showValue && (
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{min}%</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {value}%
            </span>
            <span>{max}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider; 
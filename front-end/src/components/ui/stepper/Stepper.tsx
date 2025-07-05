import React from "react";
import { FaCheck } from "react-icons/fa";

interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = "",
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center">
            <button
              onClick={() => onStepClick?.(idx)}
              disabled={!onStepClick}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep > idx
                  ? "bg-green-500 text-white"
                  : currentStep === idx
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-400"
              } ${onStepClick ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
            >
              {currentStep > idx ? (
                <FaCheck className="text-xs" />
              ) : (
                step.icon || <span className="text-xs font-medium">{idx + 1}</span>
              )}
            </button>
            <span className={`mt-2 text-xs font-medium text-center max-w-20 ${
              currentStep === idx ? "text-blue-600" : "text-gray-500"
            }`}>
              {step.label}
            </span>
            {step.description && (
              <span className="mt-1 text-xs text-gray-400 text-center max-w-24">
                {step.description}
              </span>
            )}
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-1 mx-4 rounded bg-gray-200 relative">
              <div
                className="absolute h-1 rounded bg-blue-600 transition-all duration-500"
                style={{
                  width: currentStep > idx ? "100%" : "0%",
                  left: 0,
                  top: 0,
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper; 
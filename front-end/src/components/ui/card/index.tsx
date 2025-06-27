import React, { ReactNode } from "react";

// Props interfaces for Card, CardTitle, and CardDescription
interface CardProps {
  children?: ReactNode; // Optional additional content
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: ReactNode;
}

// Card Component
const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {children}
    </div>
  );
};

// CardTitle Component
const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h4 className={`mb-1 font-medium text-gray-800 text-theme-sm dark:text-white/90 sm:text-theme-xl sm:font-semibold ${className}`}>
      {children}
    </h4>
  );
};

// CardDescription Component
const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => {
  return <div className="text-sm text-gray-500 dark:text-gray-400">{children}</div>;
};

// Named exports for better flexibility
export { Card, CardTitle, CardDescription };

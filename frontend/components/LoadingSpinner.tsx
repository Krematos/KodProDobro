
import React from 'react';

interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-blue"></div>
      <p className="mt-4 text-lg font-semibold text-brand-dark">{message}</p>
      <p className="text-sm text-gray-500 mt-1">Prosím čekejte...</p>
    </div>
  );
};

export default LoadingSpinner;

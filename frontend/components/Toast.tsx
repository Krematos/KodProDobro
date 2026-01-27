import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  isVisible: boolean;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onDismiss }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4000); // Hide after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div
      className="fixed top-5 right-5 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down flex items-center gap-3"
      role="alert"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
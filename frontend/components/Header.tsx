
import React from 'react';
import { BackIcon } from '../constants';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <div className="flex items-center mb-6">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 mr-2 rounded-full hover:bg-gray-200 transition-colors">
          {BackIcon}
        </button>
      )}
      <h1 className="text-3xl font-bold text-brand-dark">{title}</h1>
    </div>
  );
};

export default Header;

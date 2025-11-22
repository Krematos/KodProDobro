import React from 'react';
import type { NotificationPreferences } from '../App';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: NotificationPreferences;
  onPreferencesChange: (newPrefs: Partial<NotificationPreferences>) => void;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-gray-700">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
            <div className={`block w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-brand-blue' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
        </div>
    </label>
);

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ isOpen, onClose, preferences, onPreferencesChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-dark">Notification Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <p className="text-gray-600 mb-6">Choose how you want to be notified. This will simulate sending you an email.</p>
        <div className="space-y-4">
            <ToggleSwitch 
                label="New Message Notifications"
                enabled={preferences.newMessages}
                onChange={(enabled) => onPreferencesChange({ newMessages: enabled })}
            />
            <ToggleSwitch 
                label="Project Status Updates"
                enabled={preferences.projectUpdates}
                onChange={(enabled) => onPreferencesChange({ projectUpdates: enabled })}
            />
        </div>
         <button 
            onClick={onClose}
            className="w-full mt-8 bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
        >
            Done
        </button>
      </div>
    </div>
  );
};

export default NotificationSettingsModal;
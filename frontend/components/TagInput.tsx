/**
 * TagInput Component - Reusable tag input with chip display
 * Used for entering skills, keywords, etc.
 */

import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
    maxTagLength?: number;
    error?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
    tags,
    onChange,
    placeholder = 'Type and press Enter...',
    maxTags = 20,
    maxTagLength = 50,
    error,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState<string>('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Add tag on Enter
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }

        // Remove last tag on Backspace when input is empty
        if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmedValue = inputValue.trim();

        // Validation
        if (!trimmedValue) {
            setInputError('Tag cannot be empty');
            return;
        }

        if (trimmedValue.length > maxTagLength) {
            setInputError(`Tag must not exceed ${maxTagLength} characters`);
            return;
        }

        if (tags.includes(trimmedValue)) {
            setInputError('This tag already exists');
            return;
        }

        if (tags.length >= maxTags) {
            setInputError(`Maximum ${maxTags} tags allowed`);
            return;
        }

        // Add tag
        onChange([...tags, trimmedValue]);
        setInputValue('');
        setInputError('');
    };

    const removeTag = (index: number) => {
        onChange(tags.filter((_, i) => i !== index));
        setInputError('');
    };

    return (
        <div className="w-full">
            {/* Tags Display */}
            <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-sm font-medium border border-brand-blue/20 hover:bg-brand-blue/20 transition-colors"
                    >
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="hover:bg-brand-blue/30 rounded-full p-0.5 transition-colors"
                            aria-label={`Remove ${tag}`}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Input Field */}
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setInputError('');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${error || inputError
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-brand-blue focus:border-brand-blue'
                        }`}
                />
                <p className="mt-1 text-sm text-gray-500">
                    Press Enter to add • Backspace to remove last • {tags.length}/{maxTags} tags
                </p>
            </div>

            {/* Error Messages */}
            {(error || inputError) && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                    {error || inputError}
                </p>
            )}
        </div>
    );
};

export default TagInput;

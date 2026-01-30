import { useState, useEffect } from 'react';

/**
 * Hook pro debouncing hodnoty
 * 
 * Užitečné pro search inputy - čeká X ms před aktualizací hodnoty.
 * 
 * @param value - Vstupní hodnota k debounce
 * @param delay - Delay v milisekundách (default: 300ms)
 * 
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 * 
 * // Use debouncedSearch pro API call
 * useEffect(() => {
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

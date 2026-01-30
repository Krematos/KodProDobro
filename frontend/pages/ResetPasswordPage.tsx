import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input } from '../src/components/ui';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import authService from '../services/authService';

/**
 * Reset Password Page
 * 
 * Umožňuje uživateli nastavit nové heslo pomocí reset tokenu z URL.
 * Token je získán z emailu (odeslán přes ForgotPasswordPage).
 */
const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Validace: token musí existovat v URL
    useEffect(() => {
        if (!token) {
            setError('Neplatný nebo chybějící reset token. Požádejte o nový odkaz.');
        }
    }, [token]);

    const validatePassword = (): string | null => {
        if (newPassword.length < 8) {
            return 'Heslo musí mít alespoň 8 znaků.';
        }
        if (newPassword !== confirmPassword) {
            return 'Hesla se neshodují.';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Chybí reset token.');
            return;
        }

        // Validace
        const validationError = validatePassword();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await authService.resetPassword(token, newPassword);
            setSuccess(true);

            // Auto-redirect po 3 sekundách
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            const errorMessage = err.message || 'Reset hesla se nezdařil. Token může být neplatný nebo vypršel.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full">
                {/* Header s back arrow */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-gray-600 hover:text-brand-blue transition-colors p-2 hover:bg-white/50 rounded-lg"
                            aria-label="Zpět na přihlášení"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-4xl font-bold text-brand-blue">ImpactLink <span className="text-brand-red">CZ</span></h1>
                    </div>
                    <p className="text-gray-600 mt-2">Nastavení nového hesla</p>
                </div>

                {/* Card s formulářem */}
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    {success ? (
                        // Success State
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-brand-dark mb-2">Heslo změněno!</h2>
                            <p className="text-gray-600 mb-6">
                                Vaše heslo bylo úspěšně změněno. Za chvíli budete přesměrováni na přihlášení.
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={() => navigate('/login')}
                            >
                                Přejít na přihlášení
                            </Button>
                        </div>
                    ) : (
                        // Form State
                        <>
                            <h2 className="text-2xl font-bold text-brand-dark text-center mb-2">Vytvořte nové heslo</h2>
                            <p className="text-gray-600 text-center mb-6 text-sm">
                                Zadejte nové heslo pro váš účet.
                            </p>

                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                                        {error}
                                    </div>
                                )}

                                {/* Nové heslo */}
                                <div className="mb-4 relative">
                                    <Input
                                        label="Nové heslo"
                                        type={showPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                                        aria-label={showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1">Minimálně 8 znaků</p>
                                </div>

                                {/* Potvrzení hesla */}
                                <div className="mb-6 relative">
                                    <Input
                                        label="Potvrďte heslo"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                                        aria-label={showConfirmPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    isLoading={isLoading}
                                    fullWidth
                                    disabled={!token || !!error}
                                >
                                    {isLoading ? 'Resetuji heslo...' : 'Resetovat heslo'}
                                </Button>
                            </form>

                            <p className="text-center text-sm text-gray-600 mt-6">
                                Vzpomněli jste si?{' '}
                                <button
                                    onClick={() => navigate('/login')}
                                    className="font-medium text-brand-blue hover:underline"
                                >
                                    Přihlaste se
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

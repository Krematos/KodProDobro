import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../src/components/ui';
import { ArrowLeft } from 'lucide-react';
import authService from '../services/authService';

/**
 * Forgot Password Page
 * 
 * Umožňuje uživateli požádat o reset hesla zadáním emailu.
 * Backend odešle email s reset linkem (pokud účet existuje).
 */
const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.forgotPassword(email);
            setSuccess(true);
            // Success message z backendu
            console.log(response.message);
        } catch (err: any) {
            // Backend vždy vrací 200, ale pro jistotu ošetříme error
            const errorMessage = err.message || 'Něco se pokazilo. Zkuste to prosím znovu.';
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
                    <p className="text-gray-600 mt-2">Obnova hesla</p>
                </div>

                {/* Card s formulářem */}
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    {success ? (
                        // Success State
                        <div>
                            <div className="text-center mb-6">
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
                                <h2 className="text-2xl font-bold text-brand-dark mb-2">Email odeslán</h2>
                                <p className="text-gray-600">
                                    Pokud účet s emailem <strong>{email}</strong> existuje, obdržíte email s instrukcemi pro obnovení hesla.
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={() => navigate('/login')}
                            >
                                Zpět na přihlášení
                            </Button>
                        </div>
                    ) : (
                        // Form State
                        <>
                            <h2 className="text-2xl font-bold text-brand-dark text-center mb-2">Zapomněli jste heslo?</h2>
                            <p className="text-gray-600 text-center mb-6 text-sm">
                                Zadejte svůj email a my vám zašleme odkaz pro obnovení hesla.
                            </p>

                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                                        {error}
                                    </div>
                                )}

                                <Input
                                    label="Emailová adresa"
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="vase.email@example.com"
                                    className="mb-6"
                                />

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    isLoading={isLoading}
                                    fullWidth
                                >
                                    {isLoading ? 'Odesílám...' : 'Odeslat odkaz'}
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

export default ForgotPasswordPage;

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input } from '../src/components/ui';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
  onBack?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateToRegister, onBack }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ username, password });
      onLoginSuccess();
    } catch (err: any) {
      const errorMessage = err.message || 'Neplatné uživatelské jméno nebo heslo.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-blue">ImpactLink <span className="text-brand-red">CZ</span></h1>
          <p className="text-gray-600 mt-2">Propojujeme studenty s neziskovými organizacemi.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mb-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zpět
            </Button>
          )}
          <h2 className="text-2xl font-bold text-brand-dark text-center mb-6">Přihlaste se ke svému účtu</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                {error}
              </div>
            )}

            <Input
              label="Uživatelské jméno"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="jana.novakova"
              className="mb-4"
            />

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Heslo</label>
                <a href="#" className="text-sm text-brand-blue hover:underline">Zapomněli jste heslo?</a>
              </div>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                wrapperClassName="mb-0"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              fullWidth
            >
              {isLoading ? 'Přihlašování...' : 'Přihlásit se'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Nemáte účet?{' '}
            <button onClick={onNavigateToRegister} className="font-medium text-brand-blue hover:underline">
              Zaregistrujte se
            </button>
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-1">Pro testování:</p>
            <p>Vytvořte si účet nebo použijte existujícíúživatele z backendu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

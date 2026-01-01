import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you would validate credentials against a backend
    if (email === 'user@impactlink.cz' && password === 'password123') {
      console.log('Logging in with:', email);
      onLogin();
    } else {
      setError('Neplatný email nebo heslo. Zkuste to prosím znovu.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-blue">ImpactLink <span className="text-brand-red">CZ</span></h1>
          <p className="text-gray-600 mt-2">Propojujeme studenty s neziskovými organizacemi.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-brand-dark text-center mb-6">Přihlaste se ke svému účtu</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Emailová adresa</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                placeholder="jan@example.com"
              />
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Heslo</label>
                <a href="#" className="text-sm text-brand-blue hover:underline">Zapomněli jste heslo?</a>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? 'Přihlašování...' : 'Přihlásit se'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Nemáte účet?{' '}
            <button onClick={onNavigateToRegister} className="font-medium text-brand-blue hover:underline">
              Zaregistrujte se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
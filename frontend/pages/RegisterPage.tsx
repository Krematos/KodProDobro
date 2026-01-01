import React, { useState } from 'react';

interface RegisterPageProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Hesla se neshodují!");
      return;
    }

    if (password.length < 8) {
      setError("Heslo musí mít alespoň 8 znaků.");
      return;
    }

    setIsLoading(true);

    // Simulate an API call to create a new user
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Registering with:', name, email);
    onRegister();

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-blue">ImpactLink <span className="text-brand-red">CZ</span></h1>
          <p className="text-gray-600 mt-2">Vytvořte si účet a začněte.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-brand-dark text-center mb-6">Vytvořte si účet</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Celé jméno</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                placeholder="Jana Nováková"
              />
            </div>
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
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Heslo</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                placeholder="•••••••• (min. 8 znaků)"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">Potvrďte heslo</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Vytvářím účet...' : 'Vytvořit účet'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Máte již účet?{' '}
            <button onClick={onNavigateToLogin} className="font-medium text-brand-blue hover:underline">
              Přihlaste se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
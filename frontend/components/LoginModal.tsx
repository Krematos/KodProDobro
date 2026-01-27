import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'register';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    // Reset state on close
    setError(null);
    setIsLoading(false);
    setLoginEmail('');
    setLoginPassword('');
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setMode('login');
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (loginEmail === 'user@impactlink.cz' && loginPassword === 'password123') {
        onLoginSuccess();
        handleClose();
    } else {
        setError('Neplatný e-mail nebo heslo.');
    }
    setIsLoading(false);
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
     if (registerPassword.length < 8) {
        setError("Heslo musí mít alespoň 8 znaků.");
        return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Registering with:', registerName, registerEmail);
    onLoginSuccess(); // Log the user in directly after registration
    handleClose();
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-brand-blue">ImpactLink <span className="text-brand-red">CZ</span></h1>
            </div>
             <div className="flex border-b mb-6">
              <button 
                onClick={() => { setMode('login'); setError(null); }}
                className={`w-1/2 py-3 text-sm font-bold ${mode === 'login' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500'}`}
              >
                Přihlásit
              </button>
              <button 
                onClick={() => { setMode('register'); setError(null); }}
                className={`w-1/2 py-3 text-sm font-bold ${mode === 'register' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500'}`}
              >
                Vytvořit účet
              </button>
            </div>
            
            {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit}>
                    <p className="text-center text-gray-600 text-sm mb-4">Přihlaste se pro přihlášení k projektům, ukládání příležitostí a posílání zpráv organizacím.</p>
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-email">Email</label>
                        <input type="email" id="login-email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-brand-blue" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-password">Heslo</label>
                        <input type="password" id="login-password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-brand-blue" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full mt-2 bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
                        {isLoading ? 'Přihlašování...' : 'Přihlásit se'}
                    </button>
                </form>
            ) : (
                 <form onSubmit={handleRegisterSubmit}>
                    <p className="text-center text-gray-600 text-sm mb-4">Vytvořte si účet a začněte pomáhat ještě dnes.</p>
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="register-name">Celé jméno</label>
                        <input type="text" id="register-name" value={registerName} onChange={e => setRegisterName(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-brand-blue" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="register-email">Email</label>
                        <input type="email" id="register-email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-brand-blue" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="register-password">Heslo</label>
                        <input type="password" id="register-password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-brand-blue" placeholder="Min. 8 znaků"/>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full mt-2 bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
                        {isLoading ? 'Vytváření účtu...' : 'Vytvořit účet'}
                    </button>
                </form>
            )}

        </div>
      </div>
    </div>
  );
};

export default LoginModal;

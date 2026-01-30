import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HomeIcon, AiSparklesIcon, ChatIcon, ProfileIcon } from '../constants';

type NavPage = 'home' | 'ai-match' | 'chat' | 'profile';

/**
 * App Layout Component
 * 
 * Hlavní layout s bottom navigation bar.
 * Obsahuje Outlet pro vnořené routes.
 */
export const AppLayout: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems: Array<{ path: string; page: NavPage; label: string; icon: React.ReactNode }> = [
        { path: '/', page: 'home', label: 'Domů', icon: HomeIcon },
        { path: '/ai-match', page: 'ai-match', label: 'AI Match', icon: AiSparklesIcon },
        { path: '/chat', page: 'chat', label: 'Zprávy', icon: ChatIcon },
        { path: '/profile', page: 'profile', label: 'Profil', icon: ProfileIcon },
    ];

    // Determine active page based on current location
    const getActivePage = (): NavPage | null => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/ai-match')) return 'ai-match';
        if (path.startsWith('/chat')) return 'chat';
        if (path.startsWith('/profile')) return 'profile';
        return null;
    };

    const activePage = getActivePage();

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans flex flex-col">
            {/* Mobile Header */}
            <header className="bg-white shadow-md p-4 sticky top-0 z-10 md:hidden">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-brand-blue">
                        ImpactLink <span className="text-brand-red">CZ</span>
                    </h1>
                    {!isAuthenticated && (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                        >
                            Přihlásit se
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content - Outlet pro routes */}
            <div className="flex-grow pb-20 md:pb-0">
                <main className="max-w-4xl mx-auto p-4 w-full">
                    <Outlet />
                </main>
            </div>

            {/* Bottom Navigation (Mobile) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <button
                            key={item.page}
                            onClick={() => handleNavigate(item.path)}
                            className={`flex flex-col items-center justify-center w-full text-sm transition-colors duration-200 ${activePage === item.page ? 'text-brand-blue' : 'text-gray-500 hover:text-brand-blue'
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};

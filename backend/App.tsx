import React, { useState, useCallback } from 'react';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ChatPage from './pages/ChatPage';
import ChatListPage from './pages/ChatListPage';
import ProfilePage from './pages/ProfilePage';
import AIMatchPage from './pages/AIMatchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { HomeIcon, AiSparklesIcon, ChatIcon, ProfileIcon } from './constants';

type Page = 'home' | 'ai-match' | 'chat' | 'profile';
type AuthPage = 'login' | 'register';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>('login');

  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);


  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    setCurrentPage('home'); // Reset to home page on login
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setAuthPage('login'); // Go to login page on logout
  }, []);

  const navigateToProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);
  
  const navigateToChat = useCallback((chatId: string) => {
      setCurrentPage('chat');
      setSelectedChatId(chatId);
  }, []);

  const navigateBackHome = useCallback(() => {
    setSelectedProjectId(null);
    setCurrentPage('home');
  }, []);

  const navigateToChatList = useCallback(() => {
      setSelectedProjectId(null);
      setSelectedChatId(null);
      setCurrentPage('chat');
  }, []);

  const renderContent = () => {
    if (selectedProjectId) {
      return <ProjectDetailPage projectId={selectedProjectId} onBack={navigateBackHome} onChat={() => navigateToChat('chat1')} />;
    }
    switch (currentPage) {
      case 'home':
        return <HomePage onProjectSelect={navigateToProject} />;
      case 'ai-match':
        return <AIMatchPage onProjectSelect={navigateToProject} />;
      case 'chat':
        if (selectedChatId) {
            return <ChatPage chatId={selectedChatId} onBack={navigateToChatList} />;
        }
        return <ChatListPage onChatSelect={navigateToChat} />;
      case 'profile':
        return <ProfilePage onLogout={handleLogout} />;
      default:
        return <HomePage onProjectSelect={navigateToProject} />;
    }
  };
  
  const navItems = [
    { page: 'home' as Page, label: 'Home', icon: HomeIcon },
    { page: 'ai-match' as Page, label: 'AI Match', icon: AiSparklesIcon },
    { page: 'chat' as Page, label: 'Messages', icon: ChatIcon },
    { page: 'profile' as Page, label: 'Profile', icon: ProfileIcon },
  ];

  if (!isAuthenticated) {
    if (authPage === 'login') {
      return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setAuthPage('register')} />;
    }
    return <RegisterPage onRegister={handleLogin} onNavigateToLogin={() => setAuthPage('login')} />;
  }

  return (
    <div className="min-h-screen bg-brand-light font-sans flex flex-col">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10 md:hidden">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-blue">ImpactLink <span className="text-brand-red">CZ</span></h1>
        </div>
      </header>

      <div className="flex-grow pb-20 md:pb-0">
        <main className="max-w-4xl mx-auto p-4 w-full">
            {renderContent()}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => {
                setSelectedProjectId(null);
                setSelectedChatId(null);
                setCurrentPage(item.page)
              }}
              className={`flex flex-col items-center justify-center w-full text-sm transition-colors duration-200 ${currentPage === item.page && !selectedProjectId ? 'text-brand-blue' : 'text-gray-500 hover:text-brand-blue'}`}
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

export default App;
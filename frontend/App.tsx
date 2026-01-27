import React, { useState, useCallback } from 'react';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ChatPage from './pages/ChatPage';
import ChatListPage from './pages/ChatListPage';
import ProfilePage from './pages/ProfilePage';
import AIMatchPage from './pages/AIMatchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateProjectPage from './pages/CreateProjectPage';
import { HomeIcon, AiSparklesIcon, ChatIcon, ProfileIcon } from './constants';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// ... types remain the same
type Page = 'home' | 'ai-match' | 'chat' | 'profile';
type AuthPage = 'login' | 'register';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [showAuth, setShowAuth] = useState(false); // Pro zobrazení přihlášení z veřejné stránky

  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const handleLoginSuccess = useCallback(() => {
    setShowAuth(false);
    setCurrentPage('home'); // Reset to home page on login
  }, []);

  const handleAuthCancel = useCallback(() => {
    setShowAuth(false);
    setCurrentPage('home');
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

  const navigateToCreateProject = useCallback(() => {
    if (!isAuthenticated) {
      setShowAuth(true);
      setAuthPage('login');
      return;
    }
    setShowCreateProject(true);
  }, [isAuthenticated]);

  const navigateBackFromCreateProject = useCallback(() => {
    setShowCreateProject(false);
    setCurrentPage('home');
  }, []);

  // Pages that require authentication
  const protectedPages: Page[] = ['ai-match', 'chat', 'profile'];

  const requiresAuth = protectedPages.includes(currentPage);

  const handlePageChange = (page: Page) => {
    // Check if page requires authentication
    if (protectedPages.includes(page) && !isAuthenticated) {
      setShowAuth(true);
      setAuthPage('login');
      return;
    }
    setSelectedProjectId(null);
    setSelectedChatId(null);
    setCurrentPage(page);
  };

  const renderContent = () => {
    if (showCreateProject) {
      return <CreateProjectPage onBack={navigateBackFromCreateProject} />;
    }
    if (selectedProjectId) {
      return <ProjectDetailPage projectId={selectedProjectId} onBack={navigateBackHome} onChat={() => navigateToChat('chat1')} />;
    }
    switch (currentPage) {
      case 'home':
        return <HomePage onProjectSelect={navigateToProject} onCreateProject={navigateToCreateProject} />;
      case 'ai-match':
        return <AIMatchPage onProjectSelect={navigateToProject} />;
      case 'chat':
        if (selectedChatId) {
          return <ChatPage chatId={selectedChatId} onBack={navigateToChatList} />;
        }
        return <ChatListPage onChatSelect={navigateToChat} />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage onProjectSelect={navigateToProject} />;
    }
  };

  const navItems = [
    { page: 'home' as Page, label: 'Domů', icon: HomeIcon },
    { page: 'ai-match' as Page, label: 'AI Match', icon: AiSparklesIcon },
    { page: 'chat' as Page, label: 'Zprávy', icon: ChatIcon },
    { page: 'profile' as Page, label: 'Profil', icon: ProfileIcon },
  ];

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-brand-dark">Načítání...</p>
        </div>
      </div>
    );
  }

  // Show login/register if user is trying to access protected page OR clicked login button
  if ((!isAuthenticated && requiresAuth) || showAuth) {
    if (authPage === 'login') {
      return <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setAuthPage('register')}
        onBack={!requiresAuth ? handleAuthCancel : undefined}
      />;
    }
    return <RegisterPage
      onRegisterSuccess={handleLoginSuccess}
      onNavigateToLogin={() => setAuthPage('login')}
      onBack={!requiresAuth ? handleAuthCancel : undefined}
    />;
  }

  return (
    <div className="min-h-screen bg-brand-light font-sans flex flex-col">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10 md:hidden">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-blue">ImpactLink <span className="text-brand-red">CZ</span></h1>
          {!isAuthenticated && (
            <button
              onClick={() => {
                setShowAuth(true);
                setAuthPage('login');
              }}
              className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              Přihlásit se
            </button>
          )}
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
              onClick={() => handlePageChange(item.page)}
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

import React, { useState, useCallback } from 'react';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ChatPage from './pages/ChatPage';
import ChatListPage from './pages/ChatListPage';
import ProfilePage from './pages/ProfilePage';
import AIMatchPage from './pages/AIMatchPage';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';
import { HomeIcon, AiSparklesIcon, ChatIcon, ProfileIcon } from './constants';

type Page = 'home' | 'ai-match' | 'chat' | 'profile';

export interface NotificationPreferences {
  newMessages: boolean;
  projectUpdates: boolean;
}

const useSavedProjects = (isAuthenticated: boolean) => {
  const [savedProjects, setSavedProjects] = useState<string[]>(() => {
    if (!isAuthenticated) return [];
    try {
      const item = window.localStorage.getItem('savedProjects');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return [];
    }
  });

  const toggleSaveProject = useCallback((projectId: string) => {
    if (!isAuthenticated) return;
    setSavedProjects(prev => {
      const isSaved = prev.includes(projectId);
      const newSaved = isSaved
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId];
      try {
        window.localStorage.setItem('savedProjects', JSON.stringify(newSaved));
      } catch (error) {
        console.error('Error writing to localStorage', error);
      }
      return newSaved;
    });
  }, [isAuthenticated]);

  const isProjectSaved = useCallback(
    (projectId: string) => isAuthenticated && savedProjects.includes(projectId),
    [savedProjects, isAuthenticated]
  );

  return { savedProjects, isProjectSaved, toggleSaveProject };
};

const useNotificationPreferences = (isAuthenticated: boolean) => {
    const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
        if (!isAuthenticated) return { newMessages: true, projectUpdates: true };
        try {
            const item = window.localStorage.getItem('notificationPreferences');
            return item ? JSON.parse(item) : { newMessages: true, projectUpdates: true };
        } catch (error) {
            console.error('Error reading notification preferences from localStorage', error);
            return { newMessages: true, projectUpdates: true };
        }
    });

    const updatePreferences = useCallback((newPrefs: Partial<NotificationPreferences>) => {
        if (!isAuthenticated) return;
        setPreferences(prev => {
            const updated = { ...prev, ...newPrefs };
            try {
                window.localStorage.setItem('notificationPreferences', JSON.stringify(updated));
            } catch (error) {
                console.error('Error writing notification preferences to localStorage', error);
            }
            return updated;
        });
    }, [isAuthenticated]);

    return { preferences, updatePreferences };
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const { savedProjects, isProjectSaved, toggleSaveProject } = useSavedProjects(isAuthenticated);
  const { preferences: notificationPreferences, updatePreferences: setNotificationPreferences } = useNotificationPreferences(isAuthenticated);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    showToast("Successfully logged in!");
  }, [showToast]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage('home'); // Go to home page on logout
  }, []);

  const requestLogin = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const navigateToProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);
  
  const navigateToChat = useCallback((chatId: string) => {
      if (!isAuthenticated) {
        requestLogin();
        return;
      }
      setCurrentPage('chat');
      setSelectedChatId(chatId);
  }, [isAuthenticated, requestLogin]);

  const navigateBackHome = useCallback(() => {
    setSelectedProjectId(null);
    setCurrentPage('home');
  }, []);

  const navigateToChatList = useCallback(() => {
      setSelectedProjectId(null);
      setSelectedChatId(null);
      setCurrentPage('chat');
  }, []);
  
  const handleNavClick = useCallback((page: Page) => {
      const protectedPages: Page[] = ['chat', 'profile', 'ai-match'];
      if (protectedPages.includes(page) && !isAuthenticated) {
          requestLogin();
          return;
      }
      setSelectedProjectId(null);
      setSelectedChatId(null);
      setCurrentPage(page);
  }, [isAuthenticated, requestLogin]);

  const renderContent = () => {
    if (selectedProjectId) {
      return <ProjectDetailPage 
                projectId={selectedProjectId} 
                onBack={navigateBackHome} 
                onChat={() => navigateToChat('chat1')} 
                isProjectSaved={isProjectSaved}
                toggleSaveProject={toggleSaveProject}
                notificationPreferences={notificationPreferences}
                showToast={showToast}
                isAuthenticated={isAuthenticated}
                requestLogin={requestLogin}
             />;
    }
    switch (currentPage) {
      case 'home':
        return <HomePage 
                  onProjectSelect={navigateToProject} 
                  isProjectSaved={isProjectSaved} 
                  toggleSaveProject={toggleSaveProject}
                  savedProjectIds={savedProjects}
                  isAuthenticated={isAuthenticated}
                  requestLogin={requestLogin}
                />;
      case 'ai-match':
        return <AIMatchPage 
                  onProjectSelect={navigateToProject}
                  isAuthenticated={isAuthenticated}
                  requestLogin={requestLogin}
                />;
      case 'chat':
        if (selectedChatId) {
            return <ChatPage 
                      chatId={selectedChatId} 
                      onBack={navigateToChatList} 
                      notificationPreferences={notificationPreferences}
                      showToast={showToast}
                    />;
        }
        return <ChatListPage onChatSelect={navigateToChat} />;
      case 'profile':
        return <ProfilePage 
                  onLogout={handleLogout} 
                  notificationPreferences={notificationPreferences}
                  setNotificationPreferences={setNotificationPreferences}
                />;
      default:
        return <HomePage 
                  onProjectSelect={navigateToProject} 
                  isProjectSaved={isProjectSaved} 
                  toggleSaveProject={toggleSaveProject}
                  savedProjectIds={savedProjects}
                  isAuthenticated={isAuthenticated}
                  requestLogin={requestLogin}
                />;
    }
  };
  
  const navItems = [
    { page: 'home' as Page, label: 'Home', icon: HomeIcon },
    { page: 'ai-match' as Page, label: 'AI Match', icon: AiSparklesIcon },
    { page: 'chat' as Page, label: 'Messages', icon: ChatIcon },
    { page: 'profile' as Page, label: 'Profile', icon: ProfileIcon },
  ];


  return (
    <div className="min-h-screen bg-brand-light font-sans flex flex-col">
       <Toast message={toastMessage} isVisible={!!toastMessage} onDismiss={() => setToastMessage(null)} />
       <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLogin}
       />
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-brand-blue cursor-pointer" onClick={() => handleNavClick('home')}>ImpactLink <span className="text-brand-red">CZ</span></h1>
           {!isAuthenticated && (
              <div className="flex items-center gap-2">
                  <button onClick={requestLogin} className="text-sm font-semibold text-brand-blue hover:text-opacity-80">
                      Sign In
                  </button>
                   <button onClick={requestLogin} className="text-sm font-semibold text-white bg-brand-blue px-3 py-1.5 rounded-lg hover:bg-opacity-80 transition-colors">
                      Sign Up
                  </button>
              </div>
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
              onClick={() => handleNavClick(item.page)}
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

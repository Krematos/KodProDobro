import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { CURRENT_USER, GAMIFICATION_BADGES, BriefcaseIcon, TrophyIcon, CogIcon, ProfileIcon } from '../constants';

interface ProfilePageProps {
  onLogout: () => void;
}

type ProfileTab = 'about' | 'portfolio' | 'achievements';

const ProgressBar: React.FC<{ value: number; max: number; }> = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className="bg-accent-yellow h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};


const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('about');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Dummy function for project navigation from portfolio
  const handleProjectSelect = (id: string) => {
    console.log("Navigating to project", id, "is not implemented in this view.");
  };

  const handleApplyNow = (id: string) => {
    console.log("Cannot apply to a project from the portfolio view.", id);
  };

  const xpForNextLevel = CURRENT_USER.level * 500;

  const tabs = [
    { id: 'about', label: 'O mně', icon: <div className="w-6 h-6">{ProfileIcon}</div> },
    { id: 'portfolio', label: 'Portfolio', icon: <div className="w-5 h-5">{BriefcaseIcon}</div> },
    { id: 'achievements', label: 'Úspěchy', icon: <div className="w-5 h-5">{TrophyIcon}</div> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-2">O mně</h3>
              <p className="text-gray-700 leading-relaxed">{CURRENT_USER.bio}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-dark mb-3">Moje dovednosti</h3>
              <div className="flex flex-wrap gap-2">
                {CURRENT_USER.skills.map(skill => (
                  <span key={skill} className="bg-teal-100 text-accent-teal text-sm font-medium px-3 py-1.5 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="animate-fade-in">
            {CURRENT_USER.portfolio.length > 0 ? (
              CURRENT_USER.portfolio.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={handleProjectSelect}
                  onApply={handleApplyNow}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">Zatím žádné dokončené projekty. Dokončete projekt a přidejte ho do svého portfolia!</p>
            )}
          </div>
        );
      case 'achievements':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-brand-dark mb-4">Moje úspěchy</h3>
            <div className="space-y-4">
              {GAMIFICATION_BADGES.map(badge => {
                const progress = badge.progress(CURRENT_USER);
                const isEarned = progress.current >= progress.target;
                return (
                  <div key={badge.name} className={`p-4 rounded-lg flex items-center gap-4 border ${isEarned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-100 border-gray-200'}`}>
                    <div className={`flex-shrink-0 ${!isEarned && 'opacity-40'}`}>{badge.icon}</div>
                    <div className="w-full">
                      <p className={`font-bold ${isEarned ? 'text-yellow-900' : 'text-brand-dark'}`}>{badge.name}</p>
                      <p className="text-xs text-gray-600">{badge.description}</p>
                      {!isEarned && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                            <span>Postup</span>
                            <span>{progress.current} / {progress.target}</span>
                          </div>
                          <ProgressBar value={progress.current} max={progress.target} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 relative">
        <div className="absolute top-4 right-4 z-10">
          <div className="relative">
            <button onClick={() => setSettingsOpen(!settingsOpen)} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-brand-dark transition-colors">
              {CogIcon}
            </button>
            {settingsOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl"
                onMouseLeave={() => setSettingsOpen(false)}
              >
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg">Upravit profil</a>
                <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg">
                  Odhlásit se
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center mb-6">
          <div className="relative">
            <img src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
            <div className="absolute -bottom-2 -right-2 bg-accent-yellow text-brand-dark font-bold text-sm w-10 h-10 rounded-full flex items-center justify-center border-2 border-white">
              {CURRENT_USER.level}
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-brand-dark">{CURRENT_USER.name}</h2>
            <p className="text-gray-600">{CURRENT_USER.fieldOfStudy}</p>
            <p className="text-sm text-gray-500">{CURRENT_USER.university}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="mb-3">
            <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
              <span>Postup úrovní</span>
              <span>{CURRENT_USER.xp} / {xpForNextLevel} XP</span>
            </div>
            <ProgressBar value={CURRENT_USER.xp} max={xpForNextLevel} />
          </div>
          <div className="flex justify-around text-center mt-4">
            <div>
              <p className="text-2xl font-bold text-brand-blue">{CURRENT_USER.totalImpact}</p>
              <p className="text-sm text-gray-500 font-semibold">Celkový dopad</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-blue">{CURRENT_USER.contributionStreak}x</p>
              <p className="text-sm text-gray-500 font-semibold">Série</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="flex justify-around border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`flex items-center justify-center w-full py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none ${activeTab === tab.id
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-gray-500 hover:text-brand-blue'
                }`}
            >
              <div className="mr-2">{tab.icon}</div>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfilePage;
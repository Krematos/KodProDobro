import React, { useState, useCallback } from 'react';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { findMatchingProjects, AIProjectMatch } from '../services/geminiService';
import { PROJECTS, CURRENT_USER } from '../constants';
import type { Project } from '../types';

interface AIMatchPageProps {
  onProjectSelect: (projectId: string) => void;
  isAuthenticated: boolean;
  requestLogin: () => void;
}

const AIMatchPage: React.FC<AIMatchPageProps> = ({ onProjectSelect, isAuthenticated, requestLogin }) => {
  const [userDescription, setUserDescription] = useState(
    `Jsem student oboru ${CURRENT_USER.fieldOfStudy} na ${CURRENT_USER.university}. Mé klíčové dovednosti jsou: ${CURRENT_USER.skills.join(', ')}. Zajímám se o ${CURRENT_USER.interests.join(', ')}.`
  );
  const [matches, setMatches] = useState<AIProjectMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindMatches = useCallback(async () => {
    if (!isAuthenticated) {
        requestLogin();
        return;
    }
    setIsLoading(true);
    setError(null);
    setMatches([]);
    try {
      const results = await findMatchingProjects(userDescription, PROJECTS);
      setMatches(results);
    } catch (err) {
      setError("Omlouváme se, momentálně se nám nepodařilo najít shody. Zkuste to prosím později.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userDescription, isAuthenticated, requestLogin]);

  return (
    <div>
      <Header title="AI Doporučování projektů" />
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-700 mb-4">
          Popište své dovednosti, zájmy a co v projektu hledáte. Naše AI pro vás najde perfektní shodu z našeho seznamu příležitostí!
        </p>
        
        <textarea
          value={userDescription}
          onChange={(e) => setUserDescription(e.target.value)}
          rows={5}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
          placeholder="např. Jsem React vývojář se zájmem o vzdělávání..."
        />
        
        <button
          onClick={handleFindMatches}
          disabled={isLoading}
          className="w-full mt-4 bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Hledám shody...' : 'Najít můj ideální projekt'}
        </button>
      </div>

      <div className="mt-8">
        {isLoading && <LoadingSpinner message="Analyzuji váš profil..." />}
        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
        {matches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Vaše nejlepší shody</h2>
            {matches.map(match => {
                const project = PROJECTS.find(p => p.id === match.projectId);
                if (!project) return null;
                return <MatchCard key={match.projectId} project={project} match={match} onSelect={onProjectSelect} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

interface MatchCardProps {
    project: Project;
    match: AIProjectMatch;
    onSelect: (projectId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ project, match, onSelect }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border-2 border-accent-yellow">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-semibold text-accent-yellow">AI Doporučuje</p>
                        <h3 className="text-xl font-bold text-brand-dark mt-1">{project.title}</h3>
                        <p className="text-sm text-gray-600">organizace {project.organization.name}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-brand-dark">{match.matchScore}%</div>
                        <div className="text-sm text-gray-500">Skóre shody</div>
                    </div>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-800">Proč je to skvělá volba:</p>
                    <p className="text-sm text-yellow-700 mt-1">{match.reasoning}</p>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t">
                <button onClick={() => onSelect(project.id)} className="text-sm font-semibold text-brand-blue hover:underline">
                    Zobrazit detail projektu &rarr;
                </button>
            </div>
        </div>
    );
};

export default AIMatchPage;


import React, { useState, useCallback, useEffect } from 'react';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { findMatchingProjects, AIProjectMatch } from '../services/geminiService';
import { getProjects } from '../services/projectService';
import { getCurrentUser } from '../services/userService';
import type { Project, User } from '../types';

interface AIMatchPageProps {
  onProjectSelect: (projectId: string) => void;
}

const AIMatchPage: React.FC<AIMatchPageProps> = ({ onProjectSelect }) => {
  const [userDescription, setUserDescription] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [matches, setMatches] = useState<AIProjectMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const [fetchedProjects, currentUser] = await Promise.all([
          getProjects(),
          getCurrentUser()
        ]);
        setProjects(fetchedProjects);

        // Construct default description from user profile
        const skills = currentUser.skills?.join(', ') || 'general skills';
        const interests = currentUser.interests?.join(', ') || 'general interests';
        const study = currentUser.fieldOfStudy ? `${currentUser.fieldOfStudy} student` : 'student';

        setUserDescription(
          `I am a ${study}. My key skills include: ${skills}. I am interested in ${interests}.`
        );
      } catch (err) {
        console.error("Failed to load initial data", err);
        setError("Failed to load profile or projects.");
      } finally {
        setIsInitializing(false);
      }
    };

    initData();
  }, []);

  const handleFindMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMatches([]);
    try {
      const results = await findMatchingProjects(userDescription, projects);
      setMatches(results);
    } catch (err) {
      setError("Sorry, we couldn't find matches at this time. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userDescription]);

  return (
    <div>
      <Header title="AI Párování projektů" />
      {isInitializing ? (
        <div className="p-8"><LoadingSpinner message="Načítám data..." /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-700 mb-4">
            Popište své dovednosti, zájmy a co hledáte v projektu. Naše AI pro vás najde ideální shodu z našeho seznamu příležitostí!
          </p>

          <textarea
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
            placeholder="např. Jsem React vývojář s vášní pro vzdělávání..."
          />

          <button
            onClick={handleFindMatches}
            disabled={isLoading}
            className="w-full mt-4 bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? 'Hledání shod...' : 'Najít můj ideální projekt'}
          </button>
        </div>
      )}

      <div className="mt-8">
        {isLoading && <LoadingSpinner message="Analyzuji váš profil..." />}
        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
        {matches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Vaše nejlepší shody</h2>
            {matches.map(match => {
              const project = projects.find(p => p.id.toString() === match.projectId);
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
            <p className="text-sm font-semibold text-accent-yellow">Doporučeno AI</p>
            <h3 className="text-xl font-bold text-brand-dark mt-1">{project.name || project.title}</h3>
            <p className="text-sm text-gray-600">od {project.organization?.name || 'Neznámá organizace'}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-brand-dark">{match.matchScore}%</div>
            <div className="text-sm text-gray-500">Skóre shody</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800">Proč je to skvělá shoda:</p>
          <p className="text-sm text-yellow-700 mt-1">{match.reasoning}</p>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t">
        <button onClick={() => onSelect(project.id.toString())} className="text-sm font-semibold text-brand-blue hover:underline">
          Zobrazit detaily projektu &rarr;
        </button>
      </div>
    </div>
  );
};

export default AIMatchPage;

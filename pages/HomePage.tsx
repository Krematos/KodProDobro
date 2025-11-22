import React, { useState, useMemo } from 'react';
import ProjectCard from '../components/ProjectCard';
import { PROJECTS, CURRENT_USER, ORGANIZATIONS } from '../constants';

interface HomePageProps {
  onProjectSelect: (projectId: string) => void;
  isProjectSaved: (projectId: string) => boolean;
  toggleSaveProject: (projectId: string) => void;
  savedProjectIds: string[];
  isAuthenticated: boolean;
  requestLogin: () => void;
}
// Keeping internal keys English for mapping logic
type StatusFilter = 'Saved' | 'Open' | 'In Progress' | 'Completed' | 'All';

const HomePage: React.FC<HomePageProps> = ({ onProjectSelect, isProjectSaved, toggleSaveProject, savedProjectIds, isAuthenticated, requestLogin }) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Open');
  const [skillFilter, setSkillFilter] = useState<string>('All');
  const [organizationFilter, setOrganizationFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allSkills = useMemo(() => {
    return [...new Set(PROJECTS.flatMap(p => p.requiredSkills))].sort();
  }, []);

  const allOrganizations = useMemo(() => {
    return Object.values(ORGANIZATIONS).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const statusOptions: StatusFilter[] = ['Saved', 'Open', 'In Progress', 'Completed', 'All'];
  const statusLabels: Record<StatusFilter, string> = {
      'Saved': 'Uložené',
      'Open': 'Otevřené',
      'In Progress': 'V řešení',
      'Completed': 'Dokončené',
      'All': 'Vše'
  };

  const filteredProjects = useMemo(() => {
    return PROJECTS
      .filter(project => {
        if (statusFilter === 'Saved') {
            if (!isAuthenticated) return false;
            return savedProjectIds.includes(project.id);
        }
        if (statusFilter === 'All') return true;
        return project.status === statusFilter;
      })
      .filter(project => {
        if (organizationFilter === 'All') return true;
        return project.organization.id === organizationFilter;
      })
      .filter(project => {
        if (skillFilter === 'All') return true;
        return project.requiredSkills.includes(skillFilter);
      })
      .filter(project => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.summary.toLowerCase().includes(query) ||
          project.organization.name.toLowerCase().includes(query) ||
          project.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
  }, [statusFilter, skillFilter, organizationFilter, searchQuery, savedProjectIds, isAuthenticated]);

  const handleApplyNow = (projectId: string) => {
    if (!isAuthenticated) {
        requestLogin();
        return;
    }
    const project = PROJECTS.find(p => p.id === projectId);
    alert(`Děkujeme za váš zájem o projekt "${project?.title}"! Vaše přihláška byla odeslána ke kontrole.`);
  };

  const handleToggleSave = (projectId: string) => {
    if (!isAuthenticated) {
        requestLogin();
        return;
    }
    toggleSaveProject(projectId);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">
          {isAuthenticated ? `Vítejte, ${CURRENT_USER.name.split(' ')[0]}!` : "Prozkoumejte projekty"}
        </h1>
        <p className="text-gray-600 mt-1">Jste připraveni mít dopad? Najděte příležitosti u předních českých neziskovek.</p>
      </div>
      
      <div className="mb-4 relative">
          <input
              type="text"
              placeholder="Hledat projekty, organizace nebo štítky..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
          </div>
      </div>
      
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filtrovat podle stavu</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => {
                        if (status === 'Saved' && !isAuthenticated) return null;
                        return (
                           <button
                             key={status}
                             onClick={() => setStatusFilter(status)}
                             className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                statusFilter === status
                                    ? 'bg-brand-blue text-white shadow'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                             }`}
                           >
                             {statusLabels[status]}
                           </button>
                        )
                    })}
                  </div>
              </div>
               <div>
                   <label htmlFor="org-filter" className="block text-sm font-medium text-gray-700 mb-2">Organizace</label>
                    <select
                        id="org-filter"
                        value={organizationFilter}
                        onChange={(e) => setOrganizationFilter(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                    >
                        <option value="All">Všechny organizace</option>
                        {allOrganizations.map(org => (
                            <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                    </select>
              </div>
              <div>
                   <label htmlFor="skill-filter" className="block text-sm font-medium text-gray-700 mb-2">Dovednosti</label>
                    <select
                        id="skill-filter"
                        value={skillFilter}
                        onChange={(e) => setSkillFilter(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                    >
                        <option value="All">Všechny dovednosti</option>
                        {allSkills.map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                        ))}
                    </select>
              </div>
          </div>
      </div>
      
      <h2 className="text-2xl font-bold text-brand-dark mb-4">
        {statusFilter !== 'All' ? `${statusLabels[statusFilter]} projekty` : 'Všechny projekty'}
      </h2>
      
      <div>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onSelect={onProjectSelect}
              onApply={handleApplyNow} 
              isProjectSaved={isProjectSaved}
              toggleSaveProject={handleToggleSave}
            />
          ))
        ) : (
           <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
             <h3 className="text-xl font-semibold text-brand-dark">Nebyly nalezeny žádné projekty</h3>
             <p className="text-gray-500 mt-2">Zkuste upravit vyhledávání nebo filtry.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

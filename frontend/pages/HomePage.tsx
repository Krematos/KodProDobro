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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const allSkills = useMemo(() => {
    return [...new Set(PROJECTS.flatMap(p => p.requiredSkills))].sort();
  }, []);

  const allTags = useMemo(() => {
    return [...new Set(PROJECTS.flatMap(p => p.tags))].sort();
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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
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
        if (selectedTags.length === 0) return true;
        return project.tags.some(tag => selectedTags.includes(tag));
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
  }, [statusFilter, skillFilter, organizationFilter, selectedTags, searchQuery, savedProjectIds, isAuthenticated]);

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

      <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 text-xs uppercase tracking-wider">Stav projektu</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => {
                        if (status === 'Saved' && !isAuthenticated) return null;
                        return (
                           <button
                             key={status}
                             onClick={() => setStatusFilter(status)}
                             className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                                statusFilter === status
                                    ? 'bg-brand-blue text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                             }`}
                           >
                             {statusLabels[status]}
                           </button>
                        )
                    })}
                  </div>
              </div>
               <div>
                   <label htmlFor="org-filter" className="block text-sm font-bold text-gray-700 mb-3 text-xs uppercase tracking-wider">Organizace</label>
                    <select
                        id="org-filter"
                        value={organizationFilter}
                        onChange={(e) => setOrganizationFilter(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition text-sm font-medium"
                    >
                        <option value="All">Všechny organizace</option>
                        {allOrganizations.map(org => (
                            <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                    </select>
              </div>
              <div>
                   <label htmlFor="skill-filter" className="block text-sm font-bold text-gray-700 mb-3 text-xs uppercase tracking-wider">Dovednosti</label>
                    <select
                        id="skill-filter"
                        value={skillFilter}
                        onChange={(e) => setSkillFilter(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition text-sm font-medium"
                    >
                        <option value="All">Všechny dovednosti</option>
                        {allSkills.map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                        ))}
                    </select>
              </div>
          </div>

          <div className="border-t pt-5">
              <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold text-gray-700 text-xs uppercase tracking-wider">Témata a štítky</label>
                  {selectedTags.length > 0 && (
                      <button
                        onClick={() => setSelectedTags([])}
                        className="text-xs font-bold text-brand-red hover:underline"
                      >
                        Zrušit výběr ({selectedTags.length})
                      </button>
                  )}
              </div>
              <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                      <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                              selectedTags.includes(tag)
                                  ? 'bg-accent-teal border-accent-teal text-white shadow-sm'
                                  : 'bg-white border-gray-200 text-gray-500 hover:border-accent-teal hover:text-accent-teal'
                          }`}
                      >
                          {tag}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-2xl font-bold text-brand-dark">
            {statusFilter !== 'All' ? `${statusLabels[statusFilter]} projekty` : 'Všechny projekty'}
        </h2>
        <span className="text-sm font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
            Nalezeno: {filteredProjects.length}
        </span>
      </div>

      <div className="space-y-2">
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
           <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
             <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h3 className="text-xl font-semibold text-brand-dark">Nebyly nalezeny žádné projekty</h3>
             <p className="text-gray-500 mt-2 max-w-xs mx-auto">Zkuste upravit vyhledávání nebo změnit nastavené filtry.</p>
             <button
                onClick={() => {
                    setStatusFilter('All');
                    setSkillFilter('All');
                    setOrganizationFilter('All');
                    setSelectedTags([]);
                    setSearchQuery('');
                }}
                className="mt-6 text-brand-blue font-bold hover:underline"
             >
                Resetovat všechny filtry
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
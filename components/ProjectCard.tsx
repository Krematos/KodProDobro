import React from 'react';
import type { Project } from '../types';
import { CodeIcon, DesignIcon, StarIcon, BookmarkFilledIcon, BookmarkOutlineIcon } from '../constants';

interface ProjectCardProps {
  project: Project;
  onSelect: (projectId: string) => void;
  onApply: (projectId: string) => void;
  isProjectSaved?: (projectId: string) => boolean;
  toggleSaveProject?: (projectId: string) => void;
}

const HighlightBanner: React.FC<{ text: string }> = ({ text }) => (
    <div className="absolute top-0 left-0 bg-accent-yellow text-brand-dark text-xs font-bold px-3 py-1 rounded-br-lg z-10 flex items-center">
        <div className="w-4 h-4 mr-1.5">{StarIcon}</div>
        {text}
    </div>
);

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, onApply, isProjectSaved, toggleSaveProject }) => {
  const hasCodeSkill = project.requiredSkills.some(skill => 
    /react|flutter|node|python|javascript|html/i.test(skill)
  );
  const hasDesignSkill = project.requiredSkills.some(skill => 
    /design|figma|ux|ui|wireframe|mockup|illustration/i.test(skill)
  );

  const isSaved = isProjectSaved ? isProjectSaved(project.id) : false;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer mb-6 relative"
      onClick={() => onSelect(project.id)}
    >
      {project.highlight && <HighlightBanner text={project.highlight} />}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-brand-blue">{project.organization.name}</p>
                {project.organization.isCommunityChampion && (
                    <span title="Community Champion" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>
                        Champion
                    </span>
                )}
            </div>
            <h3 className="text-xl font-bold text-brand-dark mt-1">{project.title}</h3>
          </div>
          <img src={project.organization.logoUrl} alt={`${project.organization.name} logo`} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 ml-4" />
        </div>
        <p className="text-gray-600 mt-3 text-sm">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-brand-blue text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
         <div className="flex items-center -space-x-1">
          {hasCodeSkill && <div className="p-1.5 bg-blue-200 rounded-full z-10">{CodeIcon}</div>}
          {hasDesignSkill && <div className="p-1.5 bg-teal-200 rounded-full">{DesignIcon}</div>}
        </div>
        <div className="flex items-center gap-2">
            {toggleSaveProject && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveProject(project.id);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                        isSaved ? 'text-accent-yellow bg-yellow-100' : 'text-gray-400 hover:bg-gray-200'
                    }`}
                    title={isSaved ? "Unsave Project" : "Save Project"}
                >
                    {isSaved ? BookmarkFilledIcon : BookmarkOutlineIcon}
                </button>
            )}
            {project.status === 'Open' ? (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from navigating to details
                        onApply(project.id);
                    }}
                    className="px-4 py-2 text-sm font-bold text-white bg-accent-teal rounded-lg shadow hover:bg-opacity-80 transition-all"
                >
                    Apply Now
                </button>
            ) : (
                <span className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">
                    {project.status}
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

import React from 'react';
import Header from '../components/Header';
import { PROJECTS, BookmarkFilledIcon, BookmarkOutlineIcon } from '../constants';
import type { NotificationPreferences } from '../App';

interface ProjectDetailPageProps {
  projectId: string;
  onBack: () => void;
  onChat: () => void;
  isProjectSaved: (projectId: string) => boolean;
  toggleSaveProject: (projectId: string) => void;
  notificationPreferences: NotificationPreferences;
  showToast: (message: string) => void;
  isAuthenticated: boolean;
  requestLogin: () => void;
}

const ProjectStatusBadge: React.FC<{ status: 'Open' | 'In Progress' | 'Completed' }> = ({ status }) => {
    const statusStyles = {
        'Open': { dot: 'bg-green-500', text: 'text-green-800', bg: 'bg-green-100' },
        'In Progress': { dot: 'bg-yellow-500', text: 'text-yellow-800', bg: 'bg-yellow-100' },
        'Completed': { dot: 'bg-gray-500', text: 'text-gray-800', bg: 'bg-gray-100' }
    };
    const style = statusStyles[status];
    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${style.dot}`}></span>
            {status}
        </div>
    );
};

const HighlightBadge: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>
            {text}
        </div>
    );
};


const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId, onBack, onChat, isProjectSaved, toggleSaveProject, notificationPreferences, showToast, isAuthenticated, requestLogin }) => {
  const project = PROJECTS.find(p => p.id === projectId);

  if (!project) {
    return (
      <div>
        <Header title="Project Not Found" onBack={onBack} />
        <p>The requested project could not be found.</p>
      </div>
    );
  }

  const handleAction = (action: () => void) => {
      if (!isAuthenticated) {
          requestLogin();
          return;
      }
      action();
  }

  const handleCheckUpdates = () => {
    if (notificationPreferences.projectUpdates) {
        showToast(`Email notification: No new updates for "${project.title}".`);
    } else {
        alert(`Your project status is currently: ${project.status}. Enable email notifications in your profile for automatic updates.`);
    }
  };
  
  const handleApply = () => {
      alert(`Thank you for your interest in "${project?.title}"! Your application has been submitted for review.`);
  }

  const isSaved = isProjectSaved(project.id);

  return (
    <div className="animate-fade-in">
      <Header title={project.title} onBack={onBack} />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <div className="flex items-center mb-4 sm:mb-0">
                <img src={project.organization.logoUrl} alt={`${project.organization.name} logo`} className="w-16 h-16 rounded-lg object-cover mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-brand-dark">{project.organization.name}</h2>
                  <a href={project.organization.website} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline text-sm">{project.organization.website}</a>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                {project.highlight && <HighlightBadge text={project.highlight} />}
                <ProjectStatusBadge status={project.status} />
            </div>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-brand-blue text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          
          <h3 className="text-xl font-semibold text-brand-dark mt-6 mb-2">Project Description</h3>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
          
          <div className="mt-6 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-brand-dark mb-3">Required Skills</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {project.requiredSkills.map(skill => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-dark mb-3">Key Deliverables</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                     {project.deliverables.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold text-brand-dark mb-3">Project Details</h3>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 text-gray-700">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div>
                                <p className="font-semibold">Timeline</p>
                                <p>{project.timeline}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <div>
                                <p className="font-semibold">Commitment</p>
                                <p>{project.commitment}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            <div>
                                <p className="font-semibold">Impact Score</p>
                                <p className="font-bold text-accent-teal">{project.impactScore} points</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
             <button 
                onClick={() => handleAction(handleApply)}
                disabled={project.status !== 'Open'}
                className="col-span-2 lg:col-span-1 bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
             >
              {project.status === 'Open' ? 'Apply Now' : `Status: ${project.status}`}
            </button>
             <button 
                onClick={() => handleAction(() => toggleSaveProject(project.id))}
                className={`font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border ${isSaved ? 'bg-accent-yellow border-accent-yellow text-white' : 'border-gray-300 bg-white text-brand-dark hover:bg-gray-100'}`}
             >
              {isSaved ? BookmarkFilledIcon : BookmarkOutlineIcon}
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button 
                onClick={() => handleAction(handleCheckUpdates)}
                className="bg-gray-200 text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
              Check for Updates
            </button>
            <button 
              onClick={() => handleAction(onChat)}
              className="bg-gray-200 text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
              Ask a Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

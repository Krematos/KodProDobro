package com.kodprodobro.kodprodobro.services.project;

import com.kodprodobro.kodprodobro.dto.project.ProjectResponse;
import com.kodprodobro.kodprodobro.dto.project.UpdateProjectRequest;
import com.kodprodobro.kodprodobro.models.project.CreateProjectRequest;

import java.util.List;

public interface ProjectService {
    List<ProjectResponse> getAllPublishedProjects();
    ProjectResponse getPublishedProjectById(Long id);
    List<ProjectResponse> searchPublishedProjectsByTitle(String title);
    List<ProjectResponse> filterPublishedProjectsByTechnology(String technology);
    List<ProjectResponse> getLatestPublishedProjects();

    ProjectResponse createProject(CreateProjectRequest request, String ownerUsername);
    ProjectResponse updateProject(Long projectId, UpdateProjectRequest request, String username);
    void deleteProject(Long projectId, String username);
}

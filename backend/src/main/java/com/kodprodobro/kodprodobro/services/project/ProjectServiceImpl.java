package com.kodprodobro.kodprodobro.services.project;

import com.kodprodobro.kodprodobro.dto.project.ProjectResponse;
import com.kodprodobro.kodprodobro.dto.project.UpdateProjectRequest;
import com.kodprodobro.kodprodobro.mapper.ProjectMapper;
import com.kodprodobro.kodprodobro.models.project.CreateProjectRequest;
import com.kodprodobro.kodprodobro.models.project.Project;
import com.kodprodobro.kodprodobro.models.user.User;
import com.kodprodobro.kodprodobro.repositories.project.ProjectRepository;
import com.kodprodobro.kodprodobro.repositories.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllPublishedProjects() {
        return projectRepository.findByPublishedTrue().stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getPublishedProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .filter(Project::isPublished)
                .orElseThrow(() -> new EntityNotFoundException("Projekt nebyl nalezen"));
        return projectMapper.toResponse(project);
    }

    // implementace search, filter, latest

    @Override
    public ProjectResponse createProject(CreateProjectRequest request, String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new EntityNotFoundException("Uživatel nenalezen: " + ownerUsername));
        Project project = projectMapper.toEntity(request);
        project.setOwner(owner);
        project.setPublished(false);
        project.setCategoryId(request.getCategoryId());
        Project savedProject = projectRepository.save(project);
        log.info("Vytvořen nový projekt s ID: {} uživatelem: {}", savedProject.getId(), ownerUsername);
        return projectMapper.toResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getLatestPublishedProjects() {
        return projectRepository.findByPublishedTrue().stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .limit(10)
                .map(projectMapper::toResponse)
                .toList();
    }

    @Override
    public List<ProjectResponse> filterPublishedProjectsByTechnology(String technology) {
        return Collections.emptyList();
    }

    @Override
    public List<ProjectResponse> searchPublishedProjectsByTitle(String title) {
        return projectRepository.findByTitleContainingIgnoreCaseAndPublishedTrue(title).stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Override
    public ProjectResponse updateProject(Long projectId, UpdateProjectRequest request, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Projekt nenalezen"));
        checkOwnership(project, username);
        if (request.title() != null) project.setTitle(request.title());
        if (request.description() != null) project.setDescription(request.description());
        if (request.repositoryUrl() != null) project.setRepositoryUrl(request.repositoryUrl());
        Project updatedProject = projectRepository.save(project);
        log.info("Projekt ID {} aktualizován uživatelem {}", projectId, username);

        return projectMapper.toResponse(updatedProject);
    }

    @Override
    public void deleteProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Projekt nenalezen"));

        checkOwnership(project, username);

        projectRepository.delete(project);
        log.info("Projekt ID {} smazán uživatelem {}", projectId, username);
    }

    // --- Pomocné metody ---

    private void checkOwnership(Project project, String username) {
        if (!project.getOwner().getUsername().equals(username)) {
            throw new AccessDeniedException("Nemáte oprávnění spravovat tento projekt.");
        }
    }
}

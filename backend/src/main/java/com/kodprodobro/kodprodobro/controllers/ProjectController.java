package com.kodprodobro.kodprodobro.controllers;

import com.kodprodobro.kodprodobro.dto.project.ProjectRequest;
import com.kodprodobro.kodprodobro.models.Project;
import com.kodprodobro.kodprodobro.models.User;
import com.kodprodobro.kodprodobro.repositories.ProjectRepository;
import com.kodprodobro.kodprodobro.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    /*
    @PostMapping
    @PreAuthorize("hasRole('NONPROFIT')")
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest projectRequest) {
        log.info("POST /api/projects - Vytvoření nového projektu: {}", projectRequest.getName());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        User owner = userRepository.findByUsername(currentPrincipalName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setOwner(owner);

        Project savedProject = projectRepository.save(project);
        return ResponseEntity.ok(savedProject);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long projectId) {
        log.info("GET /api/projects/{} - Získání projektu podle ID", projectId);
        Optional<Project> project = projectRepository.findById(projectId);
        return project.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{projectId}")
    @PreAuthorize("hasRole('NONPROFIT')")
    public ResponseEntity<Project> updateProject(@Valid @PathVariable Long projectId, @RequestBody ProjectRequest projectRequest) {
        log.info("PUT /api/projects/{} - Aktualizace projektu: {}", projectId, projectRequest.getName());
        Optional<Project> projectOptional = projectRepository.findById(projectId);
        if (projectOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Project project = projectOptional.get();
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());

        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(updatedProject);
    }*/
}

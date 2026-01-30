package com.kodprodobro.kodprodobro.controllers;

import com.kodprodobro.kodprodobro.dto.message.MessageResponse;
import com.kodprodobro.kodprodobro.dto.project.ProjectResponse;
import com.kodprodobro.kodprodobro.dto.project.UpdateProjectRequest;
import com.kodprodobro.kodprodobro.models.project.CreateProjectRequest;
import com.kodprodobro.kodprodobro.repositories.project.ProjectRepository;
import com.kodprodobro.kodprodobro.services.project.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Endpointy pro správu projektů")
public class ProjectController {

    private final ProjectRepository projectRepository;

    private final ProjectService projectService;

    /**
     * Získání všech projektů.
     * @return
     */
    @Operation(summary = "Získání všech veřejných projektů", description = "Vrátí seznam všech projektů, které jsou ve stavu PUBLISHED.")
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        List<ProjectResponse> projects = projectService.getAllPublishedProjects();
        return ResponseEntity.ok(projects);
    }

    /**
     * Detail projektu podle ID.
     */
    @Operation(summary = "Detail projektu", description = "Vrátí detailní informace o projektu podle ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Projekt nalezen"),
            @ApiResponse(responseCode = "404", description = "Projekt neexistuje", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        ProjectResponse project = projectService.getPublishedProjectById(id);
        return ResponseEntity.ok(project);
    }

    /**
     * Vyhledání projektů podle názvu.
     */
    @Operation(summary = "Vyhledávání projektů", description = "Hledá projekty podle názvu (case-insensitive).")
    @GetMapping("/search")
    public ResponseEntity<List<ProjectResponse>> searchProjectsByTitle(@RequestParam String title) {
        List<ProjectResponse> projects = projectService.searchPublishedProjectsByTitle(title);
        return ResponseEntity.ok(projects);
    }

    /**
     * Filtrování projektů podle technologie.
     */
    @Operation(summary = "Filtrování projektů podle technologie", description = "Vrátí projekty, které používají zadanou technologii.")
    @GetMapping("/filter")
    public ResponseEntity<List<ProjectResponse>> filterProjectsByTechnology(@RequestParam String technology) {
        List<ProjectResponse> projects = projectService.filterPublishedProjectsByTechnology(technology);
        return ResponseEntity.ok(projects);
    }

    /**
     * Získání nejnovějších projektů.
     */
    @Operation(summary = "Získání nejnovějších projektů", description = "Vrátí seznam nejnovějších publikovaných projektů.")
    @GetMapping("/latest")
    public ResponseEntity<List<ProjectResponse>> getLatestProjects() {
        List<ProjectResponse> projects = projectService.getLatestPublishedProjects();
        return ResponseEntity.ok(projects);
    }

    /**
     * Vytvoření nového projektu.
     */
    @Operation(summary = "Vytvoření nového projektu", description = "Vytvoří nový projekt s poskytnutými údaji.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Projekt úspěšně vytvořen"),
            @ApiResponse(responseCode = "400", description = "Neplatná data"),
            @ApiResponse(responseCode = "401", description = "Nepřihlášený uživatel")
    })
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('project:create')")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request, Authentication authentication) {
        String currentUsername = authentication.getName();
        ProjectResponse createdProject = projectService.createProject(request, currentUsername);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    /**
     * Aktualizace existujícího projektu.
     */
    @Operation(summary = "Aktualizace projektu", description = "Aktualizuje údaje existujícího projektu podle ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Projekt aktualizován"),
            @ApiResponse(responseCode = "403", description = "Nemáte oprávnění upravovat tento projekt"),
            @ApiResponse(responseCode = "404", description = "Projekt nenalezen")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('project:update')")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id,
                                                         @Valid @RequestBody UpdateProjectRequest request, Authentication authentication) {
        String currentUsername = authentication.getName();
        ProjectResponse updatedProject = projectService.updateProject(id, request, currentUsername);
        return ResponseEntity.ok(updatedProject);
    }

    /**
     * Smazání projektu.
     */
    @Operation(summary = "Smazání projektu", description = "Smaže existující projekt podle ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Projekt smazán"),
            @ApiResponse(responseCode = "403", description = "Nemáte oprávnění smazat tento projekt")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('project:delete')")
    public ResponseEntity<MessageResponse> deleteProject(@PathVariable Long id, Authentication authentication) {
        String currentUsername = authentication.getName();
        projectService.deleteProject(id, currentUsername);
        return ResponseEntity.noContent().build();
    }





}

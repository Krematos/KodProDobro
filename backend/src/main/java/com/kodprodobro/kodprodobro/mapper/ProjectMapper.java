package com.kodprodobro.kodprodobro.mapper;

import com.kodprodobro.kodprodobro.dto.project.ProjectResponse;
import com.kodprodobro.kodprodobro.models.project.CreateProjectRequest;
import com.kodprodobro.kodprodobro.models.project.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(source = "owner.username", target = "ownerUsername")
    @Mapping(source = "categoryId", target = "categoryId")
    ProjectResponse toResponse(Project project);

    // Konverze DTO (Request) -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "published", constant = "false")
    Project toEntity(CreateProjectRequest request);
}

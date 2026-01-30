package com.kodprodobro.kodprodobro.dto.project;

public record UpdateProjectRequest(
        String title,
        String description,
        String repositoryUrl,
        String liveDemoUrl,

        Long categoryId,

        boolean published
) {
}

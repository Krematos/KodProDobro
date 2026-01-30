package com.kodprodobro.kodprodobro.dto.project;

public record ProjectResponse(
        Long id,
        String title,
        String description,

        Long categoryId,

        boolean published,

        String ownerUsername,
        String repositoryUrl,
        String liveDemoUrl
) {
}

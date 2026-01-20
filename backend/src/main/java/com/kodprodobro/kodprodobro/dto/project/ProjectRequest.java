package com.kodprodobro.kodprodobro.dto.project;


public record ProjectRequest(
        String title,
        String description,
        String repositoryLink
) {
}

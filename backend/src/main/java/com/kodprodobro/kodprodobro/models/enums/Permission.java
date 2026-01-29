package com.kodprodobro.kodprodobro.models.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {
    ADMIN_READ("admin:read"),
    ADMIN_MANAGE("admin:manage"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),

    PROJECT_CREATE("project:create"),
    PROJECT_UPDATE("project:update"),
    PROJECT_DELETE("project:delete"),

    TEAM_CREATE("team:create"),
    TEAM_MANAGE_STUDENTS("team:manage_students"),

    USER_READ("user:read"),
    USER_UPDATE("user:update");

    @Getter
    private final String permission;
}

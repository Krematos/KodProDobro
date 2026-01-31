package com.kodprodobro.kodprodobro.mapper;

import com.kodprodobro.kodprodobro.dto.auth.RegisterRequest;
import com.kodprodobro.kodprodobro.dto.user.UserResponse;
import com.kodprodobro.kodprodobro.models.user.User;
import com.kodprodobro.kodprodobro.models.enums.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface UserMapper {
    // 1. Základní mapování entity na DTO
    UserResponse toDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toEntity(RegisterRequest request);

    @Named("rolesToStrings")
    static Set<String> rolesToStrings(Set<Role> roles) {
        return roles.stream()
                .map(Role::name)
                .collect(java.util.stream.Collectors.toSet());
    }
}

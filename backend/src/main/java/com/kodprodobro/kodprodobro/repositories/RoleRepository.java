package com.kodprodobro.kodprodobro.repositories;

import com.kodprodobro.kodprodobro.models.ERole;
import com.kodprodobro.kodprodobro.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}

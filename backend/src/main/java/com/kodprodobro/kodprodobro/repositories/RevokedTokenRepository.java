package com.kodprodobro.kodprodobro.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<String, Long> {
    boolean existsByToken(String token);


}

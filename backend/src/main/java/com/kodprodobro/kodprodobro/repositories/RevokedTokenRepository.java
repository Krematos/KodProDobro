package com.kodprodobro.kodprodobro.repositories;

import com.kodprodobro.kodprodobro.models.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    boolean existsByToken(String token);


}

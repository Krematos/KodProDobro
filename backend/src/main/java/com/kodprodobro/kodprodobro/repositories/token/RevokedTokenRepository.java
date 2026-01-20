package com.kodprodobro.kodprodobro.repositories.token;

import com.kodprodobro.kodprodobro.models.token.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    boolean existsByToken(String token);


}

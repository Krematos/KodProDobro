package com.kodprodobro.kodprodobro.repositories;

import com.kodprodobro.kodprodobro.models.User;
import com.kodprodobro.kodprodobro.models.token.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    // 2. Metoda pro smazání všech tokenů daného uživatele
    void deleteByUser(User user);
    // 3. Metoda pro Cron Job (automatický úklid)
    void deleteByExpiryDateBefore(Instant now);
}

package com.kodprodobro.kodprodobro.repositories.user;

import com.kodprodobro.kodprodobro.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their username.
     *
     * @param username the username to search for
     * @return an {@link Optional} containing the user if found
     */
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    /**
     * Najde uživatele podle jeho resetovacího tokenu.
     *
     * @param token resetovací token
     * @return {@link Optional} obsahující uživatele, pokud existuje
     */
    Optional<User> findByPasswordResetToken(String token);

    boolean existsByUsernameAndIdNot(String username, Long id);

    boolean existsByEmailAndIdNot(String email, Long id);
}

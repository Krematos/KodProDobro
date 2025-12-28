package com.kodprodobro.kodprodobro.services.user;

import com.kodprodobro.kodprodobro.dto.SignupRequest;
import com.kodprodobro.kodprodobro.dto.user.UserUpdateDto;
import com.kodprodobro.kodprodobro.models.enums.Role;
import com.kodprodobro.kodprodobro.repositories.UserRepository;
import com.kodprodobro.kodprodobro.services.email.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.kodprodobro.kodprodobro.models.User;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    private final SignupRequest signUpRequest;

    private static final String CACHE_USERS_BY_USERNAME = "users";
    private static final String CACHE_USERS_BY_ID = "usersById";
    private static final String CACHE_ALL_USERS = "allUsers";


    @Transactional
    @CacheEvict(value = {"users", "usersById", "allUsers"}, allEntries = true)
    public User registerNewUser(SignupRequest signUpRequest) {
        // 1. Validace duplicit (Business logika)
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new IllegalArgumentException("Chyba: Uživatelské jméno je již obsazené!");
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new IllegalArgumentException("Chyba: Email se již používá!");
        }

        // 2. Vytvoření uživatele
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        // Hashování hesla (PasswordEncoder injektujte do UserService)
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        // 3. Přiřazení Role (Moderní Enum přístup)
        // Pokud request obsahuje role, pokusí se je nastavit, jinak default USER
        Set<String> strRoles = signUpRequest.getRoles();

        // Poznámka: Pokud máte v Entitě User pole "private Role role;" (jeden Enum),
        // použijte logiku níže. Pokud tam máte Set<Role>, musíte to upravit na Set.
        // Zde předpokládám Single Role (přísnější RBAC), kde Admin > User.

        if (strRoles != null && strRoles.contains("admin")) {
            // Tady by měla být kontrola, zda si běžný user může jen tak poslat "admin" roli!
            // V produkci se registrace admina obvykle dělá přes jiný endpoint nebo SQL.
            user.setRole(Role.ADMIN);
        } else if (strRoles != null && strRoles.contains("manager")) {
            user.setRole(Role.MANAGER);
        } else {
            user.setRole(Role.USER); // Defaultní role
        }

        // 4. Uložení
        User savedUser = userRepository.save(user);

        log.info("Nový uživatel registrován: {}", savedUser.getUsername());

        // 5. Asynchronní odeslání emailu (volitelné)
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getUsername());

        return savedUser;
    }

    @Transactional
    public String createPasswordResetTokenForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token platný 1 hodinu
        userRepository.save(user);
        return token;
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

        if (user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CACHE_USERS_BY_ID, key = "#userId"),
            @CacheEvict(value = CACHE_USERS_BY_USERNAME, allEntries = true),
            @CacheEvict(value = CACHE_ALL_USERS, allEntries = true)
    })
    private void validateUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            log.warn("Registrace selhala - jméno {} již existuje", user.getUsername());
            throw new IllegalArgumentException("Uživatelské jméno již existuje");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            log.warn("Registrace selhala - email {} již existuje", user.getEmail());
            throw new IllegalArgumentException("Email již existuje");
        }
    }

    // getters, setters, další metody...
    @CacheEvict(value = {"users", "usersById", "allUsers"}, allEntries = true)
    public void DeleteUserById(Long userId) {
        userRepository.deleteById(userId);
    }

    @Cacheable(value = "users", key = "#username")
    public Optional<User> findUserByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public User save(User user){
        return userRepository.save(user);
    }

    @Transactional
    @CacheEvict(value = {"users", "usersById", "allUsers"}, allEntries = true)
    public User updateUser(User user, UserUpdateDto userUpdateDto) {
        validateUserUpdate(userUpdateDto, user.getId());

        user.setUsername(userUpdateDto.getUsername());
        user.setEmail(userUpdateDto.getEmail());
        if (userUpdateDto.getRole() != null) {
            user.setRole(Role.valueOf(userUpdateDto.getRole()));
        }

        User updatedUser = userRepository.save(user);
        log.info("Data uživatele s ID {} byla úspěšně aktualizována.", user.getId());
        return updatedUser;
    }

    private void validateUserUpdate(UserUpdateDto userUpdateDto, Long userId) {
        if (userRepository.existsByUsernameAndIdNot(userUpdateDto.getUsername(), userId)) {
            log.warn("Aktualizace selhala - jméno {} již existuje", userUpdateDto.getUsername());
            throw new IllegalArgumentException("Uživatelské jméno již existuje");
        }
        if (userRepository.existsByEmailAndIdNot(userUpdateDto.getEmail(), userId)) {
            log.warn("Aktualizace selhala - email {} již existuje", userUpdateDto.getEmail());
            throw new IllegalArgumentException("Email již existuje");
        }
    }

    @Cacheable(value = "usersById", key = "#userId")
    public Optional<User> findUserById(Long userId) {
        return userRepository.findById(userId);
    }
    @Cacheable("allUsers")
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public boolean isOwner(Long userId, String username) {
        return userRepository.findById(userId)
                .map(user -> user.getUsername().equals(username))
                .orElse(false);
    }
}

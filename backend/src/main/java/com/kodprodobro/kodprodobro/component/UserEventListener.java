package com.kodprodobro.kodprodobro.component;

import com.kodprodobro.kodprodobro.event.UserRegisterEvent;
import com.kodprodobro.kodprodobro.services.email.EmailService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

public class UserEventListener {
    private EmailService emailService;
    @Async // Běží v jiném vlákně
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT) // Až když je user bezpečně v DB
    public void handleUserRegistered(UserRegisterEvent event) {
        emailService.sendWelcomeEmail(
                event.user().getEmail(),
                event.user().getUsername()
        );
    }
}

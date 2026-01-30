package com.kodprodobro.kodprodobro.controllers;

import com.kodprodobro.kodprodobro.dto.message.SendMessageRequest;
import com.kodprodobro.kodprodobro.models.chat.Chat;
import com.kodprodobro.kodprodobro.models.chat.ChatMessage;
import com.kodprodobro.kodprodobro.models.user.User;
import com.kodprodobro.kodprodobro.repositories.chat.ChatMessageRepository;
import com.kodprodobro.kodprodobro.repositories.chat.ChatRepository;
import com.kodprodobro.kodprodobro.repositories.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Chat> getUserChats() {
        return chatRepository.findAll();
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long chatId) {
        log.info("GET /api/chats/{}/messages - Získání zpráv pro chat", chatId);
        if (!chatRepository.existsById(chatId)) {
            return ResponseEntity.notFound().build();
        }
        List<ChatMessage> messages = chatMessageRepository.findByChatId(chatId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{chatId}/messages")
    public ResponseEntity<ChatMessage> sendMessage(@PathVariable Long chatId, @RequestBody SendMessageRequest messageRequest) {
        log.info("POST /api/chats/{}/messages - Odeslání zprávy do chatu", chatId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        User sender = userRepository.findByUsername(currentPrincipalName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Chat> chatOptional = chatRepository.findById(chatId);
        if (chatOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Chat chat = chatOptional.get();

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChat(chat);
        chatMessage.setSender(sender);
        chatMessage.setContent(messageRequest.content());

        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
        return ResponseEntity.ok(savedMessage);
    }
}

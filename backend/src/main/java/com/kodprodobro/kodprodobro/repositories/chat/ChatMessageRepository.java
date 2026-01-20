package com.kodprodobro.kodprodobro.repositories.chat;

import com.kodprodobro.kodprodobro.models.chat.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatId(Long chatId);
}

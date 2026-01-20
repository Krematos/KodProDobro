package com.kodprodobro.kodprodobro.dto.message;


public record SendMessageRequest(
        String recipientId,
        String content
) {
}

package com.anvith.ai_knowledge_assistant.auth.dto;

import com.anvith.ai_knowledge_assistant.auth.entity.UserEntity;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        LocalDateTime createdAt
) {

    public static UserResponse from(UserEntity user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}

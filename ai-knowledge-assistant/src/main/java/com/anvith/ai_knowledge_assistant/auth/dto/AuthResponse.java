package com.anvith.ai_knowledge_assistant.auth.dto;

import java.time.Instant;

public record AuthResponse(
        String token,
        Instant expiresAt,
        UserResponse user
) {
}

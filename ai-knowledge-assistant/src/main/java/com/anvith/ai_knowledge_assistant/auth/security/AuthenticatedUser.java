package com.anvith.ai_knowledge_assistant.auth.security;

/**
 * Principal stored in the SecurityContext for requests carrying a valid JWT.
 */
public record AuthenticatedUser(
        Long id,
        String email
) {
}

package com.anvith.ai_knowledge_assistant.auth.service;

import com.anvith.ai_knowledge_assistant.auth.entity.UserEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private static final String SECRET = "test-secret-that-is-definitely-long-enough-123";

    private final JwtService jwtService = new JwtService(new ObjectMapper(), SECRET, 24);

    private final UserEntity user = UserEntity.builder()
            .id(42L)
            .fullName("Ada Lovelace")
            .email("ada@example.com")
            .build();

    @Test
    void validTokenResolvesToUserId() {
        String token = jwtService.generateToken(user, jwtService.getExpiryFromNow());

        assertEquals(42L, jwtService.validateAndGetUserId(token).orElseThrow());
    }

    @Test
    void expiredTokenIsRejected() {
        String token = jwtService.generateToken(user, Instant.now().minusSeconds(5));

        assertTrue(jwtService.validateAndGetUserId(token).isEmpty());
    }

    @Test
    void tamperedPayloadIsRejected() {
        String token = jwtService.generateToken(user, jwtService.getExpiryFromNow());
        String[] parts = token.split("\\.");
        String forged = parts[0] + "." + parts[1].substring(0, parts[1].length() - 2) + "xx." + parts[2];

        assertTrue(jwtService.validateAndGetUserId(forged).isEmpty());
    }

    @Test
    void tokenSignedWithAnotherSecretIsRejected() {
        JwtService other = new JwtService(new ObjectMapper(), "another-secret-that-is-also-long-enough-456", 24);
        String token = other.generateToken(user, other.getExpiryFromNow());

        assertTrue(jwtService.validateAndGetUserId(token).isEmpty());
    }

    @Test
    void garbageIsRejected() {
        assertTrue(jwtService.validateAndGetUserId("not-a-jwt").isEmpty());
        assertTrue(jwtService.validateAndGetUserId("a.b.c").isEmpty());
    }

    @Test
    void shortSecretFailsFast() {
        assertThrows(IllegalStateException.class, () -> new JwtService(new ObjectMapper(), "too-short", 24));
    }
}

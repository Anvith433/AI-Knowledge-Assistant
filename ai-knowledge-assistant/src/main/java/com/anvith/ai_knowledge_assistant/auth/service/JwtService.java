package com.anvith.ai_knowledge_assistant.auth.service;

import com.anvith.ai_knowledge_assistant.auth.entity.UserEntity;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Issues and verifies HS256 JSON Web Tokens.
 */
@Slf4j
@Service
public class JwtService {

    private static final String ALGORITHM = "HmacSHA256";
    private static final String HEADER = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";

    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final Duration expiration;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${app.jwt.secret:}") String secret,
            @Value("${app.jwt.expiration-hours:24}") long expirationHours
    ) {
        this.objectMapper = objectMapper;
        this.expiration = Duration.ofHours(expirationHours);

        if (secret == null || secret.isBlank()) {
            // Keeps local setups working; tokens will not survive a restart
            log.warn("app.jwt.secret is not set. Using a random secret - users will be signed out on every restart.");
            byte[] random = new byte[32];
            new SecureRandom().nextBytes(random);
            this.secret = random;
        } else {
            if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
                throw new IllegalStateException("app.jwt.secret must be at least 32 characters long.");
            }
            this.secret = secret.getBytes(StandardCharsets.UTF_8);
        }
    }

    public Instant getExpiryFromNow() {
        return Instant.now().plus(expiration);
    }

    public String generateToken(UserEntity user, Instant expiresAt) {

        Map<String, Object> claims = new LinkedHashMap<>();
        claims.put("sub", String.valueOf(user.getId()));
        claims.put("email", user.getEmail());
        claims.put("iat", Instant.now().getEpochSecond());
        claims.put("exp", expiresAt.getEpochSecond());

        try {
            String header = ENCODER.encodeToString(HEADER.getBytes(StandardCharsets.UTF_8));
            String payload = ENCODER.encodeToString(objectMapper.writeValueAsBytes(claims));
            String unsigned = header + "." + payload;
            return unsigned + "." + ENCODER.encodeToString(sign(unsigned));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not generate token", ex);
        }
    }

    /**
     * Returns the user id for a valid, unexpired token, otherwise empty.
     */
    public Optional<Long> validateAndGetUserId(String token) {

        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return Optional.empty();
            }

            String unsigned = parts[0] + "." + parts[1];
            byte[] expected = sign(unsigned);
            byte[] actual = DECODER.decode(parts[2]);
            if (!MessageDigest.isEqual(expected, actual)) {
                return Optional.empty();
            }

            Map<String, Object> claims = objectMapper.readValue(
                    DECODER.decode(parts[1]),
                    new TypeReference<>() {}
            );

            long exp = ((Number) claims.get("exp")).longValue();
            if (Instant.now().getEpochSecond() >= exp) {
                return Optional.empty();
            }

            return Optional.of(Long.parseLong((String) claims.get("sub")));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    private byte[] sign(String data) throws GeneralSecurityException {
        Mac mac = Mac.getInstance(ALGORITHM);
        mac.init(new SecretKeySpec(secret, ALGORITHM));
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }
}

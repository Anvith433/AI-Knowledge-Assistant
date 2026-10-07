package com.anvith.ai_knowledge_assistant.auth.service;

import com.anvith.ai_knowledge_assistant.auth.dto.AuthResponse;
import com.anvith.ai_knowledge_assistant.auth.dto.LoginRequest;
import com.anvith.ai_knowledge_assistant.auth.dto.SignupRequest;
import com.anvith.ai_knowledge_assistant.auth.dto.UserResponse;
import com.anvith.ai_knowledge_assistant.auth.entity.UserEntity;
import com.anvith.ai_knowledge_assistant.auth.repository.UserRepository;
import com.anvith.ai_knowledge_assistant.exception.ConflictException;
import com.anvith.ai_knowledge_assistant.exception.ResourceNotFoundException;
import com.anvith.ai_knowledge_assistant.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // ===========================
    // Sign Up
    // ===========================

    @Transactional
    public AuthResponse signup(SignupRequest request) {

        String email = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists. Try signing in instead.");
        }

        UserEntity user = UserEntity.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .createdAt(LocalDateTime.now())
                .build();

        return buildAuthResponse(userRepository.save(user));
    }

    // ===========================
    // Login
    // ===========================

    public AuthResponse login(LoginRequest request) {

        UserEntity user = userRepository.findByEmail(normalizeEmail(request.getEmail()))
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPassword()))
                .orElseThrow(() -> new UnauthorizedException("Incorrect email or password."));

        return buildAuthResponse(user);
    }

    // ===========================
    // Current User
    // ===========================

    public UserResponse getUser(Long userId) {

        return userRepository.findById(userId)
                .map(UserResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id : " + userId));
    }

    private AuthResponse buildAuthResponse(UserEntity user) {

        Instant expiresAt = jwtService.getExpiryFromNow();

        return new AuthResponse(
                jwtService.generateToken(user, expiresAt),
                expiresAt,
                UserResponse.from(user)
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}

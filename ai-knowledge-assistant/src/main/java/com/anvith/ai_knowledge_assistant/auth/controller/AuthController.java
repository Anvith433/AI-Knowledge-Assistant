package com.anvith.ai_knowledge_assistant.auth.controller;

import com.anvith.ai_knowledge_assistant.auth.dto.AuthResponse;
import com.anvith.ai_knowledge_assistant.auth.dto.LoginRequest;
import com.anvith.ai_knowledge_assistant.auth.dto.SignupRequest;
import com.anvith.ai_knowledge_assistant.auth.dto.UserResponse;
import com.anvith.ai_knowledge_assistant.auth.security.AuthenticatedUser;
import com.anvith.ai_knowledge_assistant.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signup(
            @Valid
            @RequestBody SignupRequest request
    ) {

        return authService.signup(request);

    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid
            @RequestBody LoginRequest request
    ) {

        return authService.login(request);

    }

    @GetMapping("/me")
    public UserResponse me(
            @AuthenticationPrincipal AuthenticatedUser user
    ) {

        return authService.getUser(user.id());

    }

}

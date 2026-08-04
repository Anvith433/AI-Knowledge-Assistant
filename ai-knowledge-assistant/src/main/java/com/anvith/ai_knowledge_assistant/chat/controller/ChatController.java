package com.anvith.ai_knowledge_assistant.chat.controller;

import com.anvith.ai_knowledge_assistant.chat.dto.ChatHistoryResponse;
import com.anvith.ai_knowledge_assistant.chat.dto.ChatRequest;
import com.anvith.ai_knowledge_assistant.chat.dto.ChatResponse;
import com.anvith.ai_knowledge_assistant.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ChatResponse chat(
            @Valid
            @RequestBody ChatRequest request
    ) {

        return chatService.chat(request);

    }

    @GetMapping("/history")
    public List<ChatHistoryResponse> getChatHistory() {

        return chatService.getChatHistory();

    }

}
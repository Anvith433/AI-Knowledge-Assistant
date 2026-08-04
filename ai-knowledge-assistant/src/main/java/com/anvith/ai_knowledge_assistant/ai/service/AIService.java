package com.anvith.ai_knowledge_assistant.ai.service;

import com.anvith.ai_knowledge_assistant.rag.service.RagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIService {

    private final RagService ragService;

    public String ask(String question) {
        return ragService.askQuestion(question);
    }
}
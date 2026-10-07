package com.anvith.ai_knowledge_assistant.chat.service;

import com.anvith.ai_knowledge_assistant.ai.service.AIService;
import com.anvith.ai_knowledge_assistant.chat.dto.ChatHistoryResponse;
import com.anvith.ai_knowledge_assistant.chat.dto.ChatRequest;
import com.anvith.ai_knowledge_assistant.chat.dto.ChatResponse;
import com.anvith.ai_knowledge_assistant.chat.entity.ChatEntity;
import com.anvith.ai_knowledge_assistant.chat.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private AIService aiService;

    @Autowired
    private ChatRepository chatRepository;

    // ===========================
    // Ask AI
    // ===========================

    public ChatResponse chat(ChatRequest request, Long userId) {

        String answer = aiService.ask(request.getQuestion());

        ChatEntity chatEntity = ChatEntity.builder()
                .question(request.getQuestion())
                .answer(answer)
                .createdAt(LocalDateTime.now())
                .userId(userId)
                .build();

        chatRepository.save(chatEntity);

        return new ChatResponse(answer);
    }

    // ===========================
    // Chat History
    // ===========================

    public List<ChatHistoryResponse> getChatHistory(Long userId) {

        List<ChatEntity> chats = chatRepository.findByUserIdOrderByCreatedAtAsc(userId);

        List<ChatHistoryResponse> response = new ArrayList<>();

        for (ChatEntity chat : chats) {

            response.add(

                    new ChatHistoryResponse(

                            chat.getId(),
                            chat.getQuestion(),
                            chat.getAnswer(),
                            chat.getCreatedAt()

                    )

            );

        }

        return response;
    }
}
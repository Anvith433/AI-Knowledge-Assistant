package com.anvith.ai_knowledge_assistant.chat.repository;

import com.anvith.ai_knowledge_assistant.chat.entity.ChatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Long> {

}
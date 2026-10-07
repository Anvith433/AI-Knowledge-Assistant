package com.anvith.ai_knowledge_assistant.chat.repository;

import com.anvith.ai_knowledge_assistant.chat.entity.ChatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Long> {

    List<ChatEntity> findByUserIdOrderByCreatedAtAsc(Long userId);

}
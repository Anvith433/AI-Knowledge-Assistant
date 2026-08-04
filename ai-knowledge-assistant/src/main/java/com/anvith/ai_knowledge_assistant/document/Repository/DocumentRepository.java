package com.anvith.ai_knowledge_assistant.document.repository;

import com.anvith.ai_knowledge_assistant.document.entity.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {

}
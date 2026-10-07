package com.anvith.ai_knowledge_assistant.chat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_entity")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Owner of this conversation entry (nullable for rows created before auth existed)
    @Column(name = "user_id")
    private Long userId;

}
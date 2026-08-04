package com.anvith.ai_knowledge_assistant.document.repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class VectorStoreRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void deleteVectorsByDocumentId(Long documentId) {

        String sql = """
                DELETE FROM vector_store
                WHERE metadata ->> 'documentId' = ?
                """;

        jdbcTemplate.update(sql, documentId.toString());

    }

}
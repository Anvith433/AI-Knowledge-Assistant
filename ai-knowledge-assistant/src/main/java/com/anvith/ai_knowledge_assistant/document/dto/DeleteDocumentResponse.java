package com.anvith.ai_knowledge_assistant.document.dto;

public class DeleteDocumentResponse {

    private Long documentId;
    private String message;

    public DeleteDocumentResponse() {
    }

    public DeleteDocumentResponse(Long documentId, String message) {
        this.documentId = documentId;
        this.message = message;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
package com.anvith.ai_knowledge_assistant.document.dto;

public class UploadDocumentResponse {

    private Long documentId;

    private String fileName;

    private String message;

    public UploadDocumentResponse() {
    }

    public UploadDocumentResponse(Long documentId,
                                  String fileName,
                                  String message) {
        this.documentId = documentId;
        this.fileName = fileName;
        this.message = message;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
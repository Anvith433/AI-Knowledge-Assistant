package com.anvith.ai_knowledge_assistant.exception;
public class ActiveDocumentExistsException extends RuntimeException 
{
    public ActiveDocumentExistsException(String message) 
    {
        super(message);
    }
}
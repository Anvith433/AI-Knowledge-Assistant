package com.anvith.ai_knowledge_assistant.document.service;
import com.anvith.ai_knowledge_assistant.chat.repository.ChatRepository;
import com.anvith.ai_knowledge_assistant.document.dto.DeleteDocumentResponse;
import com.anvith.ai_knowledge_assistant.document.dto.DocumentMetaDataResponse;
import com.anvith.ai_knowledge_assistant.document.dto.UploadDocumentResponse;
import com.anvith.ai_knowledge_assistant.document.entity.DocumentEntity;
import com.anvith.ai_knowledge_assistant.document.repository.DocumentRepository;
import com.anvith.ai_knowledge_assistant.document.repository.VectorStoreRepository;
import com.anvith.ai_knowledge_assistant.exception.ActiveDocumentExistsException;
import com.anvith.ai_knowledge_assistant.exception.BadRequestException;
import com.anvith.ai_knowledge_assistant.exception.ResourceNotFoundException;
import com.anvith.ai_knowledge_assistant.ingestion.service.DocumentIngestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentIngestionService ingestionService;

    @Autowired
    private VectorStoreRepository vectorStoreRepository;

    @Autowired
    private ChatRepository chatRepository;

    /**
     * Upload a new PDF document.
     * Only one active document is allowed.
     */
    @Transactional(rollbackFor = Exception.class)
    public UploadDocumentResponse uploadDocument(MultipartFile file) throws IOException {

        // Check if file is empty
        if (file.isEmpty()) {
            throw new BadRequestException(
                    "Please upload a non-empty PDF file."
            );
        }

        // Allow only PDF files
        if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new BadRequestException(
                    "Only PDF files are allowed."
            );
        }

        // Allow only one active document
        if (documentRepository.count() > 0) {
            throw new ActiveDocumentExistsException(
                    "An active document already exists. Delete it before uploading another document."
            );
        }

        // Save document metadata
        DocumentEntity document = DocumentEntity.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .uploadedAt(LocalDateTime.now())
                .status("UPLOADED")
                .build();

        DocumentEntity savedDocument = documentRepository.save(document);

        // Generate embeddings and store them in PGVector
        ingestionService.ingest(
                file,
                savedDocument.getId(),
                savedDocument.getFileName()
        );

        return new UploadDocumentResponse(
                savedDocument.getId(),
                savedDocument.getFileName(),
                "Document uploaded successfully."
        );
    }

    /**
     * Get all uploaded documents.
     */
    public List<DocumentMetaDataResponse> getAllDocuments() {

        List<DocumentEntity> documents = documentRepository.findAll();

        List<DocumentMetaDataResponse> response = new ArrayList<>();

        for (DocumentEntity document : documents) {

            response.add(
                    new DocumentMetaDataResponse(
                            document.getId(),
                            document.getFileName(),
                            document.getFileType(),
                            document.getFileSize(),
                            document.getUploadedAt(),
                            document.getStatus()
                    )
            );
        }

        return response;
    }

    /**
     * Delete active document.
     * Also removes:
     * 1. Vector embeddings
     * 2. Chat history
     * 3. Document metadata
     */
    @Transactional
    public DeleteDocumentResponse deleteDocument(Long documentId) {

        DocumentEntity document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found with id : " + documentId
                        )
                );

        // Delete all vector embeddings
        vectorStoreRepository.deleteVectorsByDocumentId(documentId);

        // Delete complete chat history
        chatRepository.deleteAll();

        // Delete document metadata
        documentRepository.delete(document);

        return new DeleteDocumentResponse(
                documentId,
                "Document deleted successfully."
        );
    }
}
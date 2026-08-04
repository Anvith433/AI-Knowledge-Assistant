package com.anvith.ai_knowledge_assistant.document.controller;
import com.anvith.ai_knowledge_assistant.document.dto.DocumentMetaDataResponse;
import com.anvith.ai_knowledge_assistant.document.dto.UploadDocumentResponse;
import com.anvith.ai_knowledge_assistant.document.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import com.anvith.ai_knowledge_assistant.document.dto.DeleteDocumentResponse;

@RestController
@RequestMapping("/api/document")
public class DocumentController 
{

    @Autowired
    private DocumentService documentService;

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public UploadDocumentResponse uploadDocument
    (
            @RequestParam("file") MultipartFile file
    ) throws IOException 
    {

        return documentService.uploadDocument(file);
    }

    @GetMapping
    public List<DocumentMetaDataResponse> getAllDocuments() 
    {
        return documentService.getAllDocuments();
    }

    @DeleteMapping("/{id}")
public DeleteDocumentResponse deleteDocument(
        @PathVariable Long id
) {

    return documentService.deleteDocument(id);

}
}
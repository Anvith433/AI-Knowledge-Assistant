package com.anvith.ai_knowledge_assistant.ingestion.service;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.IOException;
import java.util.List;

@Service
public class DocumentIngestionService {

    @Autowired
    private VectorStore vectorStore;

    public void ingest(
            MultipartFile file,
            Long documentId,
            String fileName
    ) throws IOException {

        ByteArrayResource resource =
                new ByteArrayResource(file.getBytes());

        PagePdfDocumentReader pdfReader =
                new PagePdfDocumentReader(resource);

        List<Document> documents =
                pdfReader.read();

        TokenTextSplitter splitter =
                new TokenTextSplitter();

        List<Document> chunks =
                splitter.split(documents);

        /*
            Attach metadata to every chunk
        */

        for (Document chunk : chunks) {

            chunk.getMetadata().put(
                    "documentId",
                    documentId
            );

            chunk.getMetadata().put(
                    "fileName",
                    fileName
            );

        }

        vectorStore.write(chunks);

    }

}
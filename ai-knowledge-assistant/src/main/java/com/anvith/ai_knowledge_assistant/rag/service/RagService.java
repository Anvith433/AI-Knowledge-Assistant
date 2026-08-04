package com.anvith.ai_knowledge_assistant.rag.service;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class RagService {

    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public String askQuestion(String question) {

        List<Document> documents = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(question)
                        .topK(5)
                        .build()
        );

        StringBuilder context = new StringBuilder();

        for (Document document : documents) {

            context.append(document.getText())
                    .append("\n\n");
        }

        String prompt = """
                You are an AI Knowledge Assistant.

                Answer ONLY using the context below.

                If the answer is not present,
                reply with:

                "I could not find this information in the uploaded documents."

                Context:

                %s

                Question:

                %s
                """.formatted(context.toString(), question);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}
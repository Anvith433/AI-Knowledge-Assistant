package com.anvith.ai_knowledge_assistant.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI aiKnowledgeAssistantOpenAPI() {

        return new OpenAPI()

                .info(
                        new Info()
                                .title("AI Knowledge Assistant API")
                                .description("Spring AI RAG Application using Ollama and PGVector")
                                .version("1.0.0")

                                .contact(
                                        new Contact()
                                                .name("Anvith Shetty")
                                                .email("your-email@example.com")
                                )
                )

                .externalDocs(
                        new ExternalDocumentation()
                                .description("Project Documentation")
                                .url("https://github.com/")
                );

    }
}
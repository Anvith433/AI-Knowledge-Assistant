# 🤖 AI Knowledge Assistant

An AI-powered PDF Question Answering application built using **Spring Boot**, **Spring AI**, **Ollama**, **PostgreSQL (PGVector)** and **React**.

The application allows users to upload a PDF document and ask questions in natural language. It uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from the uploaded document and generates accurate responses using a locally running Large Language Model.

---

# 🚀 Features

- 📄 Upload PDF documents
- 🧠 Automatic text extraction
- ✂️ Intelligent document chunking
- 🔍 Semantic search using PGVector
- 🤖 AI-powered question answering
- 💬 Chat history management
- 🗑️ Delete uploaded documents
- 🧹 Automatic cleanup of vectors and chat history
- 🌐 React Frontend
- 📚 Swagger API Documentation

---

# 🏗️ Project Architecture

```
                 React Frontend
                        │
                        ▼
               Spring Boot REST API
                        │
        ┌───────────────┴───────────────┐
        │                               │
  Document Module                 Chat Module
        │                               │
        ▼                               ▼
 PDF Text Extraction          Retrieve Similar Chunks
        │                               │
        ▼                               ▼
 Embedding Generation             Ollama (Llama 3)
        │                               │
        └───────────────┬───────────────┘
                        ▼
              PostgreSQL + PGVector
```

---

# 🧠 How RAG Works

1. Upload a PDF.
2. The application extracts text from the document.
3. The text is divided into smaller chunks.
4. Each chunk is converted into an embedding using **nomic-embed-text**.
5. Embeddings are stored in **PostgreSQL PGVector**.
6. When a user asks a question:
   - The question is converted into an embedding.
   - PGVector finds the most relevant chunks.
   - The retrieved context is sent to **Llama 3**.
   - The AI generates a context-aware answer.

---

# 🛠️ Tech Stack

## Backend

- Java 21
- Spring Boot
- Spring AI
- Spring Data JPA
- Hibernate
- Maven

## AI

- Ollama
- Llama 3
- Nomic Embed Text

## Database

- PostgreSQL
- PGVector

## Frontend

- React
- Axios
- Tailwind CSS

## Documentation

- Swagger OpenAPI

---

# 📂 Project Structure

```
AI-KNOWLEDGE-ASSISTANT-PROJECT
│
├── ai-knowledge-assistant
│     ├── ai
│     ├── chat
│     ├── document
│     ├── ingestion
│     ├── rag
│     ├── exception
│     └── ...
│
└── ai-knowledge-assistant-frontend
```

---

# 📌 Main Modules

## Document Module

- Upload PDF
- Store document metadata
- Delete document
- Manage document lifecycle

---

## Ingestion Module

- Extract text using PDFBox
- Split document into chunks
- Generate embeddings
- Store embeddings in PGVector

---

## RAG Module

- Retrieve relevant chunks
- Build AI prompt
- Send context to Llama 3

---

## Chat Module

- Ask questions
- Generate AI responses
- Store chat history

---

## Exception Module

- Global exception handling
- Validation
- Custom error responses

---

# 📦 Prerequisites

Install the following before running the project:

- Java 21
- Maven
- PostgreSQL
- Docker Desktop
- Ollama
- Node.js
- npm

---

# ⚙️ Required AI Models

Pull the required Ollama models:

```bash
ollama pull llama3
```

```bash
ollama pull nomic-embed-text
```

Start Ollama:

```bash
ollama serve
```

---

# 🐳 Start PostgreSQL + PGVector

Run Docker:

```bash
docker compose up -d
```

Verify the container:

```bash
docker ps
```

---

# 🗄️ Configure Database

Create a PostgreSQL database.

Example:

```
ai_knowledge_db
```

Enable the PGVector extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

# ▶️ Run Backend

Go to the backend folder:

```bash
cd ai-knowledge-assistant
```

Run:

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

# ▶️ Run Frontend

Go to the frontend folder:

```bash
cd ai-knowledge-assistant-frontend
```

Install dependencies:

```bash
npm install
```

Run:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 📖 API Documentation

Swagger UI:

```
http://localhost:8080/swagger-ui.html
```

---

# 📡 REST APIs

## Upload PDF

```
POST /api/document/upload
```

---

## Get Uploaded Documents

```
GET /api/document
```

---

## Delete Document

```
DELETE /api/document/{id}
```

---

## Ask AI

```
POST /api/chat
```

---

## Chat History

```
GET /api/chat/history
```

---

# 💾 Database Tables

### document_metadata

Stores uploaded document details.

### vector_store

Stores document chunks and vector embeddings.

### chat_entity

Stores user questions and AI responses.

---

# ✨ Current Features

- Upload PDF
- Extract Text
- Generate Embeddings
- Semantic Search
- RAG Pipeline
- AI Chat
- Chat History
- Document Management
- Vector Cleanup
- Exception Handling
- React Frontend

---

# 🚀 Future Improvements

- User Authentication (JWT)
- Multiple Document Support
- Role-Based Access
- Document Versioning
- Conversation Memory
- Docker Deployment
- Cloud Deployment
- Streaming AI Responses

---

# 👨‍💻 Author

**Anvith Shetty**

Computer Science Engineering Student  
PES University

---

## ⭐ If you found this project useful, consider giving it a star!
# Medical Student Chatbot RAG

This project is a **Medical Chatbot** that allows users to interact with general medical data or upload their documents to interact with it. Additionally, users can engage with the chatbot through speech-to-speech interactions. The system also includes a **dashboard** for usage analytics.

## Features:

- Interact with general medical data.
- Upload documents and interact with the chatbot.
- Speech-to-speech interaction.
- Dashboard for usage analytics.

## Services

The system consists of multiple services:

- **chatbot-service**: Handles the chatbot interactions.
- **embedding-service**: Manages document embeddings and indexing.
- **server**: Provides the backend API for the application.
- **client**: The frontend application that users interact with.

## Setup

Follow the steps below to get the application up and running:

### 1. Build and Run Services

Run the following commands to set up the application using Docker:

```bash
docker-compose build
docker-compose up
```

This will start all the required services for the project.

### 2. Setup Database

After the services are running, you need to set up the database models and seed the data:

1. Change to the `server` directory:

   ```bash
   cd server
   ```
2. Run the migration to create the database models:

   ```bash
   npm run migrate
   ```
3. Generate the Prisma client:

   ```bash
   npm run generate
   ```
4. Seed the LLM table and role table:

   ```bash
   npm run seed
   ```

### 3. Verify the Application

Once the services are running and the database is set up, you can check if everything is working:

- **Backend Application**: Go to [localhost:8080](http://localhost:8080). The backend should return a welcome page.
- **RAG Backend**: Go to [localhost:8000](http://localhost:8000). The RAG backend should return a welcome page.
- **Client Application**: Go to [localhost:3000](http://localhost:3000). The client should display the login page.


## Technologies Used:

- **RAG (Retrieval-Augmented Generation)** for the core chatbot functionality.
- **Scraping**: Document scraping is done using the Docling IBM library.
- **Express.js & Node.js**: Backend service built with Express.js and Node.js.
- **Prisma**: Database ORM for PostgreSQL.
- **PostgreSQL**: Database used to store data.
- **Next.js**: Frontend framework.
- **LLM Models**:
  - **Qwen Models** for general interaction:
    - Qwen/Qwen2.5-0.5B-Instruct
    - Qwen/Qwen2.5-1.5B-Instruct
    - Qwen/Qwen2.5-3B-Instruct
  - **Speech Model**: onnx-community/Kokoro-82M-ONNX for speech-to-speech interaction.

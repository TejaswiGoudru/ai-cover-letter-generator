# AI Cover Letter Generator

A full-stack application that leverages local LLMs via Ollama to generate professional, tailored cover letters based on job descriptions and candidate experience.

## Project Structure

- `frontend/`: Next.js application for the user interface.
- `backend/`: Express.js server interfacing with the Ollama API.
- `docker-compose.yml`: Orchid orchestration for running both services.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Ollama](https://ollama.com/) (Must be installed and running locally)
- [Docker](https://www.docker.com/) (Optional, for containerized execution)

## Setup for Development

### 1. Ollama Configuration

Ensure Ollama is installed and the desired model (e.g., `llama3.2`) is pulled:

```bash
ollama run llama3.2
```

### 2. Backend Setup

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Frontend Setup

Navigate to the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

## Running the Application

### Local Development

You will need to run both the backend and frontend servers.

#### Start Backend
```bash
cd backend
npm run dev
```
The backend server will run at `http://localhost:4000`.
Swagger documentation is available at `http://localhost:4000/api-docs`.

#### Start Frontend
```bash
cd frontend
npm run dev
```
The frontend application will be available at `http://localhost:3000`.

### Running with Docker

You can run the entire stack using Docker Compose:

```bash
docker-compose up --build
```

> [!NOTE]
> When running in Docker, ensure the backend can reach the Ollama service on your host machine. You may need to configure Ollama to listen on all interfaces or use the host's IP address.

## Technologies Used

- **Frontend**: Next.js, React, React Quill, jsPDF
- **Backend**: Node.js, Express, TypeScript, Ollama JS SDK
- **API Documentation**: Swagger/OpenAPI

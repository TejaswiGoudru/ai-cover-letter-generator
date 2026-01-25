# AI Cover Letter Generator - Backend API

This is the backend service for the AI Cover Letter Generator. It provides an Express.js API that communicates with a local Ollama instance to generate cover letters.

## Features

- **Model Management**: Fetch available Ollama models.
- **AI Generation**: Generate tailored cover letters using local LLMs.
- **API Documentation**: Built-in Swagger/OpenAPI documentation.
- **TypeScript**: Fully typed request and response objects.

## Getting Started

### Prerequisites

- [Ollama](https://ollama.com/) must be installed and running.
- Desired models (e.g., `llama3.2`) should be pulled via `ollama pull llama3.2`.

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file or set the following environment variables:

- `MONGODB_URI`: Connection string for MongoDB (default: `mongodb://localhost:27017/ai-cover-letter`)
- `JWT_SECRET`: Secret key for JWT signing (default: `your_super_secret_key_here`)
- `PORT`: Server port (default: `4000`)

## Running the Backend

Follow these steps to get the backend service up and running:

### 1. Ensure Dependencies are Running
The backend depends on Ollama and MongoDB.

- **Ollama**: Ensure it's running (`ollama list`)
- **MongoDB**: You can start a developer instance using:
  ```bash
  docker-compose -f ../docker-compose.mongodb.yml up -d
  ```

### 2. Ensure Ollama is Running
The backend depends on Ollama. Open a terminal and verify it's active:
```bash
ollama --version
# Also ensure your model is available
ollama list
```

### 2. Install Dependencies
If you haven't already:
```bash
npm install
```

### 3. Start the Server

#### Development Mode (with Hot-Reload)
This is recommended for local development:
```bash
npm run dev
```

#### Production Mode
To run the optimized production build:
```bash
npm run build
npm start
```

## Verifying the Installation

Once the server is running (defaulting to `http://localhost:4000`), you can verify it by:

1. **Accessing Swagger**: Open `http://localhost:4000/api-docs` in your browser.
2. **Testing the Models Endpoint**:
   ```bash
   curl http://localhost:4000/api/models
   ```
   You should see a JSON array of your locally installed Ollama models.

## API Documentation

Interactive API documentation is available at:
[http://localhost:4000/api-docs](http://localhost:4000/api-docs)

### Endpoints

#### `GET /api/models`
Returns a list of available model names from the local Ollama instance.

#### `POST /api/generate`
Generates a cover letter based on the provided JSON body.

**Request Body:**
```json
{
  "jobDescription": "string",
  "resumeInfo": "string",
  "companyName": "string",
  "role": "string",
  "model": "string (optional, defaults to llama3.2)",
  "userName": "string",
  "date": "string"
}
```

**Response:**
```json
{
  "content": "The generated cover letter text..."
}
```

## Environment & Configuration

The server defaults to port `4000`. Ensure that your local Ollama instance is accessible.

# FastAPI Backend Deployment

This is a high-performance FastAPI backend application for contract analysis using AI services.

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed
- Environment variables configured

### Quick Start

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd apps/backend
   ```

2. **Create environment file:**
   ```bash
   cp .env.template .env.production
   # Edit .env.production with your actual values
   ```

3. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Or build and run manually:**
   ```bash
   # Build the image
   docker build -t obligence-backend .
   
   # Run the container
   docker run -d \
     --name obligence-backend \
     -p 8000:8000 \
     --env-file .env.production \
     obligence-backend
   ```

### Production Deployment

For production environments, you can scale the application by setting the `WORKERS` environment variable:

```bash
# Using docker-compose
WORKERS=4 docker-compose up -d

# Or with docker run
docker run -d \
  --name obligence-backend \
  -p 8000:8000 \
  --env-file .env.production \
  -e WORKERS=4 \
  obligence-backend
```

### Health Check

The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-08-24T12:00:00.000Z"
}
```

### API Documentation

Once running, you can access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Environment Variables

Required environment variables (see `.env.template`):

- `MONGO_DB_URI`: MongoDB connection string
- `S3_BUCKET_NAME`: AWS S3 bucket name
- `S3_REGION`: AWS S3 region
- `S3_ACCESS_KEY_ID`: AWS access key ID
- `S3_SECRET_ACCESS_KEY`: AWS secret access key
- `PORTIA_API_KEY`: Portia AI API key
- `GOOGLE_API_KEY`: Google API key
- `MISTRAL_API_KEY`: Mistral AI API key

Optional environment variables:
- `WORKERS`: Number of uvicorn workers (default: 1)
- `LOG_LEVEL`: Logging level (default: INFO)
- `PORT`: Port to run on (default: 8000)

#!/bin/bash

# Production startup script for FastAPI application
# This script can be used as the CMD in Dockerfile for production deployments

# Get number of workers from environment variable or default to 1
WORKERS=${WORKERS:-1}

# Get log level from environment variable or default to INFO  
LOG_LEVEL=${LOG_LEVEL:-INFO}

# Get port from environment variable or default to 8000
PORT=${PORT:-8000}

# Start the application with uvicorn
exec uvicorn app.main:app \
    --host 0.0.0.0 \
    --port $PORT \
    --workers $WORKERS \
    --log-level $LOG_LEVEL \
    --access-log \
    --loop uvloop \
    --http httptools

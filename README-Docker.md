# Video Capture App - Docker Setup

This guide will help you run the Video Capture App using Docker without installing any dependencies locally.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   Open your browser and go to `http://localhost:3000`

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker directly

1. **Build the Docker image:**
   ```bash
   docker build -t video-capture-app .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 video-capture-app
   ```

3. **Access the application:**
   Open your browser and go to `http://localhost:3000`

## Development Mode

If you want to run in development mode with hot reloading:

1. **Modify the Dockerfile** (temporarily):
   ```dockerfile
   # Change the last line from:
   CMD ["npm", "start"]
   # To:
   CMD ["npm", "run", "dev"]
   ```

2. **Run with volume mounting for live code changes:**
   ```bash
   docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules video-capture-app
   ```

## What's Included

The Docker image includes:
- **Node.js 18** (Alpine Linux)
- **ffmpeg** for video processing
- **yt-dlp** for downloading videos from YouTube, Vimeo, Dailymotion
- **Python 3** and pip for yt-dlp installation
- All Node.js dependencies

## Troubleshooting

### Port already in use
If port 3000 is already in use, change the port mapping:
```bash
docker run -p 3001:3000 video-capture-app
```
Then access at `http://localhost:3001`

### Build fails
If the build fails, try:
```bash
docker system prune -a
docker build --no-cache -t video-capture-app .
```

### Container won't start
Check the logs:
```bash
docker-compose logs
# or
docker logs <container_id>
```

### Health check fails
The health check might fail initially. Wait a few minutes for the app to fully start up.

## Production Deployment

For production deployment, consider:

1. **Environment variables:**
   ```bash
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     -e DATABASE_URL=your_db_url \
     video-capture-app
   ```

2. **Resource limits:**
   ```bash
   docker run -p 3000:3000 \
     --memory=1g \
     --cpus=1 \
     video-capture-app
   ```

3. **Reverse proxy:**
   Use nginx or similar for SSL termination and load balancing.

## File Structure

```
.
├── Dockerfile          # Docker configuration
├── .dockerignore       # Files to exclude from build
├── docker-compose.yml  # Docker Compose configuration
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── health/
│   │   │       └── route.ts  # Health check endpoint
│   │   └── ...
│   └── ...
└── README-Docker.md    # This file
```

## Next Steps

1. Test the application by uploading a video file
2. Try pasting a YouTube URL
3. Test the license system functionality
4. Verify the plans page works correctly

The application should now be fully functional with all dependencies included in the Docker container! 
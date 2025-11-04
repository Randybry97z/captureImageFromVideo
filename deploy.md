# Production Deployment Guide

This guide explains how to deploy the Video Image Capture application to production.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Docker and Docker Compose (optional, for containerized deployment)

## Deployment Scripts

Two deployment scripts are provided:

### For Linux/macOS/WSL:
```bash
chmod +x deploy.sh
./deploy.sh
```

### For Windows PowerShell:
```powershell
.\deploy.ps1
```

## Manual Deployment Steps

If you prefer to deploy manually:

1. **Clean previous builds**
   ```bash
   rm -rf .next node_modules/.cache out
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Start production server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Docker Deployment

For containerized deployment:

```bash
docker-compose up -d
```

This will:
- Build the Docker image
- Start the container
- Make the app available at `http://localhost:3000`

## Production Checklist

- [ ] Environment variables are set (if needed)
- [ ] Build completed successfully
- [ ] Production server is running
- [ ] Health check endpoint is accessible (`/api/health`)
- [ ] Static assets in `public/` folder are accessible
- [ ] Docker health checks are passing (if using Docker)

## Environment Variables

If you need to set environment variables, create a `.env.production` file:

```env
NODE_ENV=production
PORT=3000
# Add other environment variables here
```

## Troubleshooting

### Build fails
- Check Node.js version (must be 18+)
- Ensure all dependencies are installed
- Check for TypeScript errors: `npm run lint`

### Server won't start
- Check if port 3000 is already in use
- Verify `.next` folder exists after build
- Check application logs for errors

### Docker issues
- Ensure Docker is running
- Check Docker logs: `docker-compose logs`
- Verify Dockerfile is correct

## Notes

- The deployment scripts do NOT require the dev server to be running
- The build process creates optimized production bundles
- Static assets in `public/` are served directly without processing


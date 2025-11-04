# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install system dependencies including ffmpeg and python for yt-dlp
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    py3-pip \
    git \
    && rm -rf /var/cache/apk/*

# Install yt-dlp globally
RUN pip3 install --no-cache-dir yt-dlp

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["npm", "start"] 
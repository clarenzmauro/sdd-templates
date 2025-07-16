# Use Node.js Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S sddserver -u 1001

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Create workspace directory for user projects
RUN mkdir -p /workspace && \
    chown -R sddserver:nodejs /app && \
    chown -R sddserver:nodejs /workspace

# Switch to non-root user
USER sddserver

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('SDD Guide Server is healthy')" || exit 1

# Set environment variables
ENV NODE_ENV=production

# Start the server
CMD ["node", "build/index.js"]

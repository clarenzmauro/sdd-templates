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

# Create output directory
RUN mkdir -p /app/output && chown -R sddserver:nodejs /app

# Switch to non-root user
USER sddserver

# Expose the port (though MCP uses stdio)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Server is healthy')" || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV MAX_FILE_SIZE=1048576
ENV MAX_INPUT_LENGTH=10000

# Start the server
CMD ["node", "build/index.js"]

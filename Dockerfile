# Base image (lightweight & secure)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions first (for better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code safely
COPY . .

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership to the new user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]

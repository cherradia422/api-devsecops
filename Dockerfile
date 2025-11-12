# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy dependency definitions first (for caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy only necessary application files
COPY src ./src
COPY server.js ./
COPY .env.example ./

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Expose app port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]

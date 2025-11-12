# -------------------------------
# Base Image
# -------------------------------
FROM node:18-alpine AS build

# Working directory inside the container
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy only the necessary source files
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY server.js ./

# -------------------------------
# Security: Non-root user
# -------------------------------
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# -------------------------------
# Expose API port
# -------------------------------
EXPOSE 5000

# -------------------------------
# Start Command
# -------------------------------
CMD ["npm", "start"]

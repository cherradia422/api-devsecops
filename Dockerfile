# -------------------------------
# Base Image
# -------------------------------
FROM node:18-alpine

# Working directory inside the container
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy source code
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY server.js ./


# -------------------------------
# Pass environment variables
# -------------------------------
# These will be injected by Jenkins using:
# docker run -e JWT_SECRET=$JWT_SECRET ...
ENV NODE_ENV=production


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
CMD ["node", "server.js"]

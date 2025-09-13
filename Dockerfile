FROM node:18-alpine AS base

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create app directory and set user
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001
WORKDIR /app
RUN chown appuser:nodejs /app

# Copy package files as appuser
USER appuser
COPY --chown=appuser:nodejs package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY --chown=appuser:nodejs . .

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

EXPOSE 5050

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

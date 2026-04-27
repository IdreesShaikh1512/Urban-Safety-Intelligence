# --- Stage 1: Install dependencies ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# --- Stage 2: Run (lean image, no secrets baked in) ---
FROM node:18-alpine
# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app .
# Remove any local .env files — secrets are injected at runtime by Cloud Run
RUN rm -f .env .env.docker
USER appuser
EXPOSE 5000
# Health check for Cloud Run readiness
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/ || exit 1
CMD ["node", "server.js"]

# ============================================================
# API Billing Platform — Multi-Stage Docker Build
# ============================================================
# Stage 1: Build the React frontends
# Stage 2: Production image with backend + static assets
# ============================================================

# ── Stage 1: Build Frontend Assets ──────────────────────────
FROM node:20-slim AS frontend-builder

WORKDIR /build

# Copy frontend package files for dependency caching
COPY frontend/package*.json ./frontend/
COPY admin-frontend/package*.json ./admin-frontend/

# Install frontend dependencies
RUN cd frontend && npm ci --silent && \
    cd ../admin-frontend && npm ci --silent

# Copy frontend source code
COPY frontend/ ./frontend/
COPY admin-frontend/ ./admin-frontend/

# Build both frontends
RUN cd frontend && npm run build && \
    cd ../admin-frontend && npm run build

# ── Stage 2: Production Image ──────────────────────────────
FROM node:20-slim AS production

# Add labels for container metadata
LABEL maintainer="Pragya Sharma"
LABEL description="API Billing Platform — Full-Stack Application"
LABEL version="1.0.0"

WORKDIR /app

# Copy backend package files and install production dependencies only
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production --silent

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend assets from builder stage
COPY --from=frontend-builder /build/frontend/dist ./frontend/dist
COPY --from=frontend-builder /build/admin-frontend/dist ./admin-frontend/dist

# Expose the backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/').then(r => {if(!r.ok) process.exit(1)}).catch(() => process.exit(1))"

# Start the backend server
CMD ["node", "backend/server.js"]

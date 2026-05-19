# ==========================================================
# Stage 1: Dependencies
# ==========================================================
FROM node:20-alpine AS deps
# libc6-compat is required for some native Node.js binaries on Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# ==========================================================
# Stage 2: Builder
# ==========================================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set up Next.js build arguments (compiled into the build bundle)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Compile Next.js project
RUN npm run build

# ==========================================================
# Stage 3: Runner
# ==========================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run the container under a non-privileged user for optimal security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permissions for caching
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Leverage output standalone tracing to keep the image extremely lightweight (~100MB)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the standalone server (contains its own tiny node_modules and server.js)
CMD ["node", "server.js"]

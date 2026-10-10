# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json server.js ./

# Minimal production image
FROM scratch AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy Node.js runtime
COPY --from=builder /usr/local/bin/node /usr/local/bin/node

# Copy the runtime libraries Node.js requires
COPY --from=builder /lib/ld-musl-aarch64.so.1 /lib/ld-musl-aarch64.so.1
COPY --from=builder /usr/lib/libgcc_s.so.1 /usr/lib/libgcc_s.so.1
COPY --from=builder /usr/lib/libstdc++.so.6.0.34 /usr/lib/libstdc++.so.6

# Copy application code
COPY --from=builder --chown=65532:65532 /app/server.js /app/server.js

USER 65532:65532

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD ["node", "-e", "require('http').get('http://127.0.0.1:3001/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]

CMD ["node", "server.js"]
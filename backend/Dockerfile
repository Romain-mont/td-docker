# --- Étape 1 : Build ---
FROM node:18-alpine AS builder

WORKDIR /app


COPY package*.json ./


RUN npm ci --only=production


FROM node:18-alpine

# Optimisation Node
ENV NODE_ENV=production

WORKDIR /app


COPY --from=builder /app/node_modules ./node_modules

# Copie du code source
COPY server.js ./
COPY package.json ./


USER node

EXPOSE 3000

CMD ["node", "server.js"]
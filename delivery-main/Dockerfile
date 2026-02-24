# Estágio 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm via corepack (mais estável com lockfile v9)
RUN corepack enable pnpm && corepack prepare pnpm@9 --activate

# Cache deps (não roda postinstall aqui)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Agora copia o projeto inteiro (inclui prisma/schema.prisma)
COPY . .

# Roda scripts após ter o código no lugar
RUN pnpm prisma generate --schema=./prisma/schema.prisma
RUN pnpm build

# Estágio 2: Runner (production)
FROM node:20-alpine AS runner

WORKDIR /app
RUN corepack enable pnpm && corepack prepare pnpm@9 --activate

# Usuário não-root
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copiar app buildado + deps
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
# (next.config.ts só é necessário se seu runtime depender dele; pode manter)
COPY --from=builder /app/next.config.ts ./next.config.ts

RUN chown -R nextjs:nodejs /app
USER nextjs

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "start"]

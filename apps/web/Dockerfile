# =============================================================================
# Monorepo Next.js 프로덕션 빌드
# Turborepo prune으로 apps/web에 필요한 패키지만 추출
# =============================================================================

# Base: Node.js + pnpm
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# -----------------------------------------------------------------------------
# 1. Prune: Turborepo로 apps/web에 필요한 파일만 추출
# -----------------------------------------------------------------------------
FROM base AS pruner
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune @ais/web --docker

# -----------------------------------------------------------------------------
# 2. Dependencies: lockfile 기반으로 의존성 설치
# -----------------------------------------------------------------------------
FROM base AS deps
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# 3. Builder: 소스 복사 → Prisma generate → 빌드
# -----------------------------------------------------------------------------
FROM base AS builder

# 빌드 타임 환경변수 (더미값 - 런타임에서 실제 값 주입)
ENV SESSION_SECRET="build-time-dummy-secret-minimum-32-characters"
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dummy"

COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .

# turbo prune이 루트 tsconfig.base.json을 포함하지 않으므로 별도 복사
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json

# Prisma client 생성 (packages/db + apps/web 모두 필요)
RUN pnpm --filter @ais/db exec prisma generate && \
    pnpm --filter @ais/web exec prisma generate

# 전체 빌드 (Turborepo가 의존 패키지 먼저 빌드)
RUN pnpm turbo build --filter=@ais/web

# -----------------------------------------------------------------------------
# 4. Migrate: builder에서 prisma + 마이그레이션 파일만 추출
#    prisma/config 모듈이 필요하므로 node_modules를 포함한 builder 기반
# -----------------------------------------------------------------------------
FROM base AS migrate
WORKDIR /app

COPY --from=builder /app/apps/web/prisma ./apps/web/prisma
COPY --from=builder /app/apps/web/prisma.config.ts ./apps/web/prisma.config.ts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules

WORKDIR /app/apps/web

CMD ["npx", "prisma", "migrate", "deploy"]

# -----------------------------------------------------------------------------
# 5. Production: standalone 출력만 복사
# -----------------------------------------------------------------------------
FROM node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# 보안: non-root 사용자
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# standalone 출력 복사
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Prisma 스키마 (런타임 Prisma Client용)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/prisma ./apps/web/prisma

USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["node", "apps/web/server.js"]

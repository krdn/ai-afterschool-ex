import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Lazy initialization to avoid issues during build time
function getPool(): Pool {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return globalForPrisma.pool;
}

function createPrismaClient(): PrismaClient {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (!globalForPrisma.prisma) {
    const pool = getPool();
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development"
        ? ['query', 'error', 'warn']
        : ['error'],
    });
  }
  return globalForPrisma.prisma;
}

// 빌드 타임에는 PrismaClient를 생성하지 않고 Proxy로 lazy init
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = createPrismaClient();
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Export pool for health check monitoring (lazy initialization)
export const pool = databaseUrl ? getPool() : undefined;

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.prismaGlobal ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

let dbConnected: boolean | null = null;
let lastCheckTime = 0;

/**
 * Checks if the Prisma database connection is live (cached for 10s on failure to avoid blocking)
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  const now = Date.now();
  if (dbConnected !== null && now - lastCheckTime < 10000) {
    return dbConnected;
  }
  lastCheckTime = now;
  try {
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000));
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeout]);
    dbConnected = true;
    return true;
  } catch {
    dbConnected = false;
    return false;
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  return await isDatabaseAvailable();
}

export function isDatabaseConnected(): boolean {
  return dbConnected === true;
}


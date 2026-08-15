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

let dbConnected = false;

/**
 * Checks if the Prisma database connection is live
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  if (dbConnected) return true;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
    return true;
  } catch {
    dbConnected = false;
    return false;
  }
}

export function isDatabaseConnected(): boolean {
  return dbConnected;
}

import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🔄 Rotating secrets locally (POSTGRES_PASSWORD & JWT_SECRET)...');

  // 1. Generate new secrets cryptographically
  // 32-char URL-safe string
  const newPostgresPassword = crypto.randomBytes(24).toString('base64url');
  // 64-hex-char string
  const newJwtSecret = crypto.randomBytes(32).toString('hex');

  // 2. Update PostgreSQL database role password using current connection
  const prismaCurrent = new PrismaClient();
  try {
    await prismaCurrent.$executeRawUnsafe(
      `ALTER USER postgres WITH PASSWORD '${newPostgresPassword.replace(/'/g, "''")}';`
    );
    console.log('✅ PostgreSQL user password updated successfully in database engine.');
  } catch (err) {
    console.warn('⚠️ Could not alter user postgres password via current connection:', (err as Error).message);
  } finally {
    await prismaCurrent.$disconnect();
  }

  // 3. Read and update .env
  const envPath = path.join(__dirname, '../.env');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }

  const newDatabaseUrl = `postgresql://postgres:${newPostgresPassword}@localhost:5432/linguaflow_db?schema=public`;

  const envMap: Record<string, string> = {
    POSTGRES_USER: 'postgres',
    POSTGRES_PASSWORD: newPostgresPassword,
    POSTGRES_DB: 'linguaflow_db',
    DATABASE_URL: `"${newDatabaseUrl}"`,
    JWT_SECRET: `"${newJwtSecret}"`,
    PORT: '4000',
    NODE_ENV: 'development',
    FRONTEND_URL: 'http://localhost:3000',
    ALLOWED_ORIGINS: 'http://localhost:3000,http://127.0.0.1:3000',
    NEXT_PUBLIC_API_URL: 'http://localhost:4000/api/v1',
  };

  // Keep existing lines if not in envMap
  const lines = envContent.split(/\r?\n/);
  const seenKeys = new Set<string>();
  const updatedLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (match) {
      const key = match[1];
      seenKeys.add(key);
      if (key in envMap) {
        updatedLines.push(`${key}=${envMap[key]}`);
      } else {
        updatedLines.push(line);
      }
    } else {
      updatedLines.push(line);
    }
  }

  // Append any missing keys
  for (const [key, val] of Object.entries(envMap)) {
    if (!seenKeys.has(key)) {
      updatedLines.push(`${key}=${val}`);
    }
  }

  fs.writeFileSync(envPath, updatedLines.join('\n'), 'utf-8');
  console.log('✅ .env updated with rotated secrets (No secrets printed).');

  // 4. Verify connection using new DATABASE_URL
  process.env.DATABASE_URL = newDatabaseUrl;
  const prismaNew = new PrismaClient({
    datasources: {
      db: {
        url: newDatabaseUrl,
      },
    },
  });

  const vocabCount = await prismaNew.vocabulary.count();
  console.log(`✅ Verified new credentials against database. Vocabulary count: ${vocabCount}`);
  await prismaNew.$disconnect();

  console.log('🎉 Secrets rotation complete and verified!');
}

main().catch((err) => {
  console.error('❌ Error during secret rotation:', err.message);
  process.exit(1);
});

import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: Redis | null = null;
let isConnected = false;

// In-memory fallback for local environments without running Redis server
const memoryStore = new Map<string, { value: string; expiresAt?: number }>();

try {
  redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 100, 1000);
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => {
    isConnected = true;
  });

  redisClient.on('error', () => {
    isConnected = false;
  });

  redisClient.connect().catch(() => {
    isConnected = false;
  });
} catch {
  isConnected = false;
}

export const redis = {
  isReady(): boolean {
    return isConnected;
  },

  async get(key: string): Promise<string | null> {
    if (redisClient && isConnected) {
      try {
        return await redisClient.get(key);
      } catch {
        // Fallback to memoryStore
      }
    }
    const item = memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return item.value;
  },

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK' | null> {
    if (redisClient && isConnected) {
      try {
        if (mode === 'EX' && duration) {
          return await redisClient.set(key, value, 'EX', duration);
        }
        return await redisClient.set(key, value);
      } catch {
        // Fallback to memoryStore
      }
    }
    const expiresAt = mode === 'EX' && duration ? Date.now() + duration * 1000 : undefined;
    memoryStore.set(key, { value, expiresAt });
    return 'OK';
  },

  async lpush(key: string, ...values: string[]): Promise<number> {
    if (redisClient && isConnected) {
      try {
        return await redisClient.lpush(key, ...values);
      } catch {
        // Fallback to memoryStore
      }
    }
    const existingStr = memoryStore.get(key)?.value;
    const list: string[] = existingStr ? JSON.parse(existingStr) : [];
    list.unshift(...values);
    memoryStore.set(key, { value: JSON.stringify(list) });
    return list.length;
  },

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    if (redisClient && isConnected) {
      try {
        return await redisClient.lrange(key, start, stop);
      } catch {
        // Fallback to memoryStore
      }
    }
    const existingStr = memoryStore.get(key)?.value;
    if (!existingStr) return [];
    try {
      const list: string[] = JSON.parse(existingStr);
      const end = stop === -1 ? undefined : stop + 1;
      return list.slice(start, end);
    } catch {
      return [];
    }
  },

  async incrby(key: string, increment: number): Promise<number> {
    if (redisClient && isConnected) {
      try {
        return await redisClient.incrby(key, increment);
      } catch {
        // Fallback to memoryStore
      }
    }
    const existing = await this.get(key);
    const newVal = (existing ? parseInt(existing, 10) : 0) + increment;
    await this.set(key, newVal.toString());
    return newVal;
  },

  async expire(key: string, seconds: number): Promise<number> {
    if (redisClient && isConnected) {
      try {
        return await redisClient.expire(key, seconds);
      } catch {
        // Fallback to memoryStore
      }
    }
    const item = memoryStore.get(key);
    if (item) {
      item.expiresAt = Date.now() + seconds * 1000;
      return 1;
    }
    return 0;
  },

  async del(key: string): Promise<number> {
    if (redisClient && isConnected) {
      try {
        return await redisClient.del(key);
      } catch {
        // Fallback to memoryStore
      }
    }
    return memoryStore.delete(key) ? 1 : 0;
  },

  async quit(): Promise<void> {
    if (redisClient) {
      try {
        await redisClient.quit();
      } catch {}
    }
  },
};

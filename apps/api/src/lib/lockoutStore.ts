import fs from 'fs';
import path from 'path';

export interface LockoutRecord {
  count: number;
  lockedUntil?: number;
}

const DATA_DIR = typeof __dirname !== 'undefined'
  ? path.resolve(__dirname, '../../data')
  : path.resolve(process.cwd(), 'apps/api/data');
const LOCKOUT_FILE = path.join(DATA_DIR, 'login-lockouts.json');

class LockoutStore {
  private cache: Record<string, LockoutRecord> = {};

  constructor() {
    this.ensureDirectory();
    this.load();
  }

  private ensureDirectory() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.error('[LockoutStore] Failed to ensure data directory:', err);
    }
  }

  private load() {
    try {
      if (fs.existsSync(LOCKOUT_FILE)) {
        const raw = fs.readFileSync(LOCKOUT_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const now = Date.now();
        // Prune entries that have passed lockedUntil
        for (const [email, record] of Object.entries(parsed as Record<string, LockoutRecord>)) {
          if (!record.lockedUntil || record.lockedUntil > now) {
            this.cache[email] = record;
          }
        }
      }
    } catch (err) {
      console.error('[LockoutStore] Failed to load login-lockouts.json, starting with empty store:', err);
      this.cache = {};
    }
  }

  private save() {
    try {
      this.ensureDirectory();
      fs.writeFileSync(LOCKOUT_FILE, JSON.stringify(this.cache, null, 2), 'utf-8');
    } catch (err) {
      console.error('[LockoutStore] Failed to persist login-lockouts.json:', err);
    }
  }

  public get(email: string): LockoutRecord | undefined {
    const record = this.cache[email.toLowerCase()];
    if (record?.lockedUntil && record.lockedUntil < Date.now()) {
      delete this.cache[email.toLowerCase()];
      this.save();
      return undefined;
    }
    return record;
  }

  public set(email: string, record: LockoutRecord): void {
    this.cache[email.toLowerCase()] = record;
    this.save();
  }

  public delete(email: string): void {
    delete this.cache[email.toLowerCase()];
    this.save();
  }

  public clear(): void {
    this.cache = {};
    this.save();
  }

  public getAll(): Record<string, LockoutRecord> {
    return this.cache;
  }
}

export const lockoutStore = new LockoutStore();

/**
 * Backwards compatibility proxy for FAILED_LOGIN_ATTEMPTS.
 * Property access/assignments automatically sync with persistent file storage.
 */
export const FAILED_LOGIN_ATTEMPTS: Record<string, LockoutRecord> = new Proxy(
  lockoutStore.getAll(),
  {
    get(_target, prop: string) {
      return lockoutStore.get(prop);
    },
    set(_target, prop: string, value: LockoutRecord) {
      lockoutStore.set(prop, value);
      return true;
    },
    deleteProperty(_target, prop: string) {
      lockoutStore.delete(prop);
      return true;
    },
    has(_target, prop: string) {
      return !!lockoutStore.get(prop);
    },
    ownKeys() {
      return Object.keys(lockoutStore.getAll());
    },
    getOwnPropertyDescriptor(_target, prop: string) {
      const val = lockoutStore.get(prop);
      if (val) {
        return {
          value: val,
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }
      return undefined;
    },
  }
);

import { prisma, isDatabaseAvailable } from '../lib/prisma.js';

export class ConfigRepository {
  private static instance: ConfigRepository;
  private inMemoryConfigs: Record<string, any> = {};

  public static getInstance(): ConfigRepository {
    if (!ConfigRepository.instance) {
      ConfigRepository.instance = new ConfigRepository();
    }
    return ConfigRepository.instance;
  }

  public async getAllConfigs(): Promise<Record<string, any>> {
    const result: Record<string, any> = { ...this.inMemoryConfigs };
    if (await isDatabaseAvailable()) {
      try {
        const rows = await prisma.systemConfig.findMany();
        for (const row of rows) {
          result[row.key] = row.value;
        }
      } catch (err) {
        console.warn('[ConfigRepository] Failed to read from DB:', err);
      }
    }
    return result;
  }

  public async getConfig(key: string): Promise<any | null> {
    if (await isDatabaseAvailable()) {
      try {
        const row = await prisma.systemConfig.findUnique({ where: { key } });
        if (row) return row.value;
      } catch (err) {
        console.warn('[ConfigRepository] Failed to read key from DB:', err);
      }
    }
    return this.inMemoryConfigs[key] !== undefined ? this.inMemoryConfigs[key] : null;
  }

  public async setConfig(
    key: string,
    value: any,
    updatedBy: string = 'system'
  ): Promise<{ before: any; after: any }> {
    const before = await this.getConfig(key);

    if (await isDatabaseAvailable()) {
      try {
        await prisma.systemConfig.upsert({
          where: { key },
          update: { value, updatedBy },
          create: { key, value, updatedBy },
        });
      } catch (err) {
        console.warn('[ConfigRepository] Failed to upsert to DB:', err);
      }
    }

    this.inMemoryConfigs[key] = value;
    return { before, after: value };
  }

  public async deleteConfig(key: string): Promise<boolean> {
    delete this.inMemoryConfigs[key];
    if (await isDatabaseAvailable()) {
      try {
        await prisma.systemConfig.delete({ where: { key } });
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }
}

export const configRepository = ConfigRepository.getInstance();

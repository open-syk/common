import { Injectable } from '@nestjs/common';
import NodeCache from 'node-cache';

import { Session } from '../../../db/postgresql';

export abstract class CacheParameters {
  public abstract generateKey(): string;
  public abstract getSearchValues(): string[];
}

@Injectable()
export class CacheService {
  private readonly cache: NodeCache;

  public constructor() {
    const ttlSeconds = 3600;
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  public async get<T>(
    parameters: CacheParameters,
    session: Session,
    searcher?: (session: Session, params: string[]) => Promise<T | null>,
  ): Promise<T | null> {
    const key = parameters.generateKey();
    const value = this.cache.get<T>(key);

    if (value || !searcher) {
      return value;
    }
    try {
      const newValue = await searcher(session, parameters.getSearchValues());
      this.cache.set(key, newValue);
      return newValue;
    } catch (error) {
      return null;
    }
  }

  public delete(keys: NodeCache.Key[]) {
    this.cache.del(keys);
  }
}

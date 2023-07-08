import { DynamicModule, Module } from '@nestjs/common';

import { CacheService } from './cache.service';

@Module({})
export class CacheModule {
  static forRoot(): DynamicModule {
    return {
      module: CacheModule,
      providers: [CacheService],
      exports: [CacheService],
    };
  }
}

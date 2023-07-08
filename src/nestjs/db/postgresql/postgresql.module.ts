import { DynamicModule, Module } from '@nestjs/common';

import { PgGateway } from './pg.service';

@Module({})
export class PostgreSQLModule {
  static forRoot(): DynamicModule {
    return {
      module: PostgreSQLModule,
      providers: [PgGateway],
      exports: [PgGateway],
    };
  }
}

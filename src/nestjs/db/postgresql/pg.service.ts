import { DynamicModule, Module } from '@nestjs/common';

import { PgGateway } from './postgresql.module';

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

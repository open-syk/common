import { Injectable } from '@nestjs/common';

import postgresql, { Session } from '../../../db/postgresql';

export type PSQLSession = Session;

const entityPostgreSQL = postgresql('postgresql');

@Injectable()
export class PgGateway {
  public async newSession(): Promise<PSQLSession> {
    return entityPostgreSQL.newSession();
  }

  public closeSession(session: PSQLSession): void {
    return entityPostgreSQL.closeSession(session);
  }

  public async onSession<T>(operation: (session: PSQLSession) => Promise<T>): Promise<T> {
    return entityPostgreSQL.onSession<T>(operation);
  }

  public async onTransaction<T>(operation: (session: PSQLSession) => Promise<T>): Promise<T> {
    return entityPostgreSQL.onTransaction<T>(operation);
  }

  public async closePool(): Promise<void> {
    return entityPostgreSQL.closePool();
  }
}

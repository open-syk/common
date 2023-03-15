import { Injectable, Scope } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { onSession, onTransaction } from '../../db/typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class Session {
  onSession = async <T>(
    dataSource: DataSource,
    callback: (manager: EntityManager) => Promise<T>,
  ): Promise<T> => {
    return onSession(dataSource, callback);
  };

  onTransaction = async <T>(
    dataSource: DataSource,
    callback: (manager: EntityManager) => Promise<T>,
  ): Promise<T> => {
    return onTransaction(dataSource, callback);
  };
}

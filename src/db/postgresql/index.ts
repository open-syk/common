import { Pool, PoolClient, PoolConfig } from 'pg';

import config from '../../config/legacy';
import logger from '../../logger';

const log = logger('postgresql');

export type Session = PoolClient;

interface Config {
  host: string;
  port: number;
  dbname: string;
  user: string;
  password: string;
  min: number;
  max: number;
  idle_timeout: number;
  connection_timeout: number;
  statement_timeout: number;
}

export interface PostgreSQL {
  newSession: () => Promise<Session>;
  closeSession: (session: Session) => void;
  onSession: <T>(operation: (session: Session) => Promise<T>) => Promise<T>;
  onTransaction: <T>(operation: (session: Session) => Promise<T>) => Promise<T>;
  closePool: () => Promise<void>;
}

const newPool = (configName: string): Pool => {
  const conf = config.get(configName) as Partial<Config>;
  const pgConfig: PoolConfig = {
    host: conf.host ?? 'localhost',
    port: conf.port ?? 25432,
    database: conf.dbname ?? '',
    user: conf.user ?? '',
    password: conf.password ?? '',
    min: conf.min ?? 20,
    max: conf.max ?? 200,
    idleTimeoutMillis: conf.idle_timeout ?? 30000,
    connectionTimeoutMillis: conf.connection_timeout ?? 5000,
    statement_timeout: conf.statement_timeout ?? 45000,
  };
  const pool = new Pool(pgConfig);
  log.info('CONNECTION_ESTABLISHED', conf, ['password']);
  return pool;
};

const wrapper = (configName: string): PostgreSQL => {
  const pool = newPool(configName);

  const newSession = (): Promise<Session> => {
    return pool.connect();
  };

  const closeSession = (session: Session): void => {
    session.release(true);
  };

  const onSession = async <T>(operation: (session: Session) => Promise<T>): Promise<T> => {
    const session = await newSession();
    try {
      const result = await operation(session);
      return result;
    } catch (error) {
      log.error('OPERATION_FAILED', operation.name, error);
      throw error;
    } finally {
      closeSession(session);
    }
  };

  const closePool = async (): Promise<void> => {
    return pool.end();
  };

  const onTransaction = async <T>(operation: (session: Session) => Promise<T>): Promise<T> => {
    const session = await newSession();
    try {
      await session.query('BEGIN');
      const value = await operation(session);
      await session.query('COMMIT');
      return value;
    } catch (error) {
      await session.query('ROLLBACK');
      log.error('TRANSACTION_FAILED', operation.name, error);
      throw error;
    } finally {
      closeSession(session);
    }
  };

  return {
    newSession,
    closeSession,
    onSession,
    onTransaction,
    closePool,
  };
};

export default wrapper;

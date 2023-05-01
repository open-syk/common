import { DataSource, EntityManager } from 'typeorm';

export interface TypeORMSession {
  onSession: <T>(dataSource: DataSource, callback: (manager: EntityManager) => Promise<T>) => Promise<T>;

  onTransaction: <T>(dataSource: DataSource, callback: (manager: EntityManager) => Promise<T>) => Promise<T>;
}

export const onSession = async <T>(
  dataSource: DataSource,
  callback: (manager: EntityManager) => Promise<T>,
): Promise<T> => {
  const queryRunner = dataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    const response = await callback(queryRunner.manager);
    return response;
  } catch (error) {
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const onTransaction = async <T>(
  dataSource: DataSource,
  callback: (manager: EntityManager) => Promise<T>,
): Promise<T> => {
  const runner = await dataSource.createQueryRunner();
  await runner.connect();
  await runner.startTransaction();
  try {
    const response = await callback(runner.manager);
    await runner.commitTransaction();
    return response;
  } catch (error) {
    await runner.rollbackTransaction();
    throw error;
  } finally {
    await runner.release();
  }
};

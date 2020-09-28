import { Pool } from 'pg';
import { DATABASE } from './config';
import { logger } from './logger';

export const pool = new Pool(DATABASE);

pool.on('error', error => logger.error('database pool error', error));

export const query = <T>(query: string, ...args: (string | number)[]) => pool.query<T>(query, args);

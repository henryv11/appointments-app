import { FastifyInstance } from 'fastify';
import { FastifyService, QueryResult, sql } from '../lib';

export abstract class AbstractRepository<Columns extends Record<string, string> = Record<string, string>>
  implements FastifyService {
  table: ReturnType<typeof sql.raw>;
  columns: {
    sql: ReturnType<typeof sql.columns>;
    map: Record<keyof Columns, ReturnType<typeof sql.raw>>;
  };

  constructor({ table = '', columns = {} as Columns }: { table?: string; columns?: Columns } = {}) {
    this.table = sql.raw(table);
    this.columns = {
      sql: sql.columns(Object.entries(columns).map(([a, b]) => [b, a])),
      map: Object.entries(columns).reduce((map, [key, value]) => {
        map[key as keyof Columns] = sql.raw(value);
        return map;
      }, {} as Record<keyof Columns, ReturnType<typeof sql.raw>>),
    };
  }

  inject({ database: { query }, errors, repositories }: FastifyInstance) {
    this.query = query;
    this.errors = errors;
    this.repositories = repositories;

    this.firstRow = res => {
      if (res.rowCount > 1) throw this.errors.internal('[database query] - expected one row, got ' + res.rowCount);
      if (res.rowCount === 0) throw this.errors.notFound('[database query] - expected one row, got none');
      return res.rows[0];
    };

    this.maybeFirstRow = res => {
      if (res.rowCount > 1) throw this.errors.internal('[database query] - expected one row, got ' + res.rowCount);
      return res.rows[0];
    };

    this.rowCount = res => res.rowCount;

    this.allRows = res => res.rows;
  }

  protected sql = sql;
  protected orderDirection = orderDirection;
  protected query!: FastifyInstance['database']['query'];
  protected errors!: FastifyInstance['errors'];
  protected repositories!: FastifyInstance['repositories'];
  protected firstRow!: <T>(res: QueryResult<T>) => T;
  protected maybeFirstRow!: <T>(res: QueryResult<T>) => T | undefined;
  protected rowCount!: (res: QueryResult) => number;
  protected allRows!: <T>(res: QueryResult<T>) => T[];
}

function orderDirection(dir: 'ASC' | 'DESC') {
  return dir === 'DESC' ? sql`DESC` : sql`ASC`;
}

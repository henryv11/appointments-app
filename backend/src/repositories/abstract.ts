import { TObject, TSchema } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { FastifyService, QueryResult, sql } from '../lib';

export abstract class AbstractRepository<Schema extends TObject<Record<string, TSchema>>> implements FastifyService {
  table: ReturnType<typeof sql.identifier>;
  columns: {
    sql: ReturnType<typeof sql.columns>;
    map: Record<keyof Schema['properties'], ReturnType<typeof sql.identifier>>;
  };

  constructor(schema: Schema) {
    this.table = sql.identifier(schema.table || '');
    const columns = Object.entries(schema.properties).reduce<[string, string][]>(
      (acc, [k, { column = k }]) => (acc.push([k, column]), acc),
      [],
    );
    this.columns = {
      sql: sql.columns(columns.map(([a, b]) => [b, a])),
      map: columns.reduce(
        (map, [key, value]) => ((map[key as keyof Schema['properties']] = sql.identifier(value)), map),
        {} as Record<keyof Schema['properties'], ReturnType<typeof sql.identifier>>,
      ),
    };
  }

  inject({ database: { query }, errors, repositories }: FastifyInstance) {
    this.query = query;
    this.errors = errors;
    this.repositories = repositories;

    this.firstRow = res => {
      if (res.rowCount === 1) return res.rows[0];
      if (res.rowCount === 0) throw this.errors.notFound('[database query] - expected one row, got none');
      throw this.errors.internal('[database query] - expected one row, got ' + res.rowCount);
    };

    this.maybeFirstRow = res => {
      if (res.rowCount <= 1) return res.rows[0];
      throw this.errors.internal('[database query] - expected one row, got ' + res.rowCount);
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

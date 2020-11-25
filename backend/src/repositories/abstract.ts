import { FastifyInstance } from 'fastify';
import { FastifyService, QueryResult, sql } from '../lib';

export abstract class AbstractRepository implements FastifyService {
  //#region [Public]

  columns: ReturnType<typeof sql.columns>;
  table: ReturnType<typeof sql.raw>;

  constructor({ columns = [], table = '' }: { columns?: string[]; table?: string } = {}) {
    this.columns = sql.columns(columns.map(column => [column, toCamelCase(column)]));
    this.table = sql.raw(table);
  }

  register({ database: { query, transaction }, errors, repositories }: FastifyInstance) {
    this.query = query;
    this.transaction = transaction;
    this.errors = errors;
    this.repositories = repositories;
  }

  //#endregion

  //#region [Protected]

  protected query!: FastifyInstance['database']['query'];
  protected transaction!: FastifyInstance['database']['transaction'];
  protected errors!: FastifyInstance['errors'];
  protected repositories!: FastifyInstance['repositories'];
  protected toSnakeCase = toSnakeCase;
  protected sql = sql;
  protected orderDirection = orderDirection;

  protected maybeFirstRow<T>(res: QueryResult<T>): T | undefined {
    if (res.rowCount > 1) throw this.errors.internal('database query, expected one row, got more');
    return res.rows[0];
  }

  protected firstRow<T>(res: QueryResult<T>): T {
    if (res.rowCount > 1) throw this.errors.internal('database query, expected one row, got more');
    if (res.rowCount === 0) throw this.errors.notFound('database query, expected one row, got none');
    return res.rows[0];
  }

  protected allRows<T>(res: QueryResult<T>): T[] {
    return res.rows;
  }

  //#endregion
}

//#region [Utils]

function orderDirection(dir: 'ASC' | 'DESC') {
  return dir === 'DESC' ? sql`DESC` : sql`ASC`;
}

function toCamelCase(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

function toSnakeCase(str: string) {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    .join('_');
}

//#endregion

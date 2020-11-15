import { FastifyInstance } from 'fastify';
import { FastifyService } from '../lib';

export abstract class AbstractRepository implements FastifyService {
  protected query!: FastifyInstance['database']['query'];
  protected firstRow!: FastifyInstance['database']['firstRow'];
  protected allRows!: FastifyInstance['database']['allRows'];
  protected transaction!: FastifyInstance['database']['transaction'];
  protected sql!: FastifyInstance['database']['SQL'];

  register({ database: { query, firstRow, allRows, transaction, SQL } }: FastifyInstance) {
    this.query = query;
    this.firstRow = firstRow;
    this.allRows = allRows;
    this.transaction = transaction;
    this.sql = SQL;
  }
}

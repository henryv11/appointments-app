import { FastifyInstance } from 'fastify';

export abstract class AbstractRepository {
  protected query!: FastifyInstance['database']['query'];
  protected firstRow!: FastifyInstance['database']['firstRow'];
  protected allRows!: FastifyInstance['database']['allRows'];
  protected transaction!: FastifyInstance['database']['transaction'];
  protected ordinal!: FastifyInstance['database']['ordinal'];
  protected unnest!: FastifyInstance['database']['unnest'];

  register({ database: { query, firstRow, allRows, transaction, ordinal, unnest } }: FastifyInstance) {
    this.query = query;
    this.firstRow = firstRow;
    this.allRows = allRows;
    this.transaction = transaction;
    this.ordinal = ordinal;
    this.unnest = unnest;
  }
}

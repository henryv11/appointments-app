import { FastifyInstance } from 'fastify';

export class AbstractRepository {
  query!: FastifyInstance['database']['query'];
  firstRow!: FastifyInstance['database']['firstRow'];
  allRows!: FastifyInstance['database']['allRows'];
  transaction!: FastifyInstance['database']['transaction'];
  ordinal!: FastifyInstance['database']['ordinal'];
  unnest!: FastifyInstance['database']['unnest'];

  register({ database: { query, firstRow, allRows, transaction, ordinal, unnest } }: FastifyInstance) {
    this.query = query;
    this.firstRow = firstRow;
    this.allRows = allRows;
    this.transaction = transaction;
    this.ordinal = ordinal;
    this.unnest = unnest;
  }
}

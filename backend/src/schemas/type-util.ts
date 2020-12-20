import {
  CustomOptions,
  StringFormatOption,
  StringOptions,
  TLiteral,
  TObject,
  TOptional,
  TSchema,
  Type,
} from '@sinclair/typebox';
import { orderDirection } from './data-types';

export function ListControl<T extends string[]>(...orderByKeys: T) {
  return Type.Object(
    {
      limit: Type.Optional(Type.Number({ description: 'database listing result limit' })),
      offset: Type.Optional(Type.Number({ description: 'database listing result offset' })),
      orderBy: Type.Optional(
        Type.Union(
          orderByKeys.map(key => Type.Literal(key) as TLiteral<T[number]>),
          {
            description: 'columns you can order the results by',
          },
        ),
      ),
      orderDirection: Type.Optional(orderDirection),
    },
    { description: 'generic database sorting and pagination options' },
  );
}

export function Partial<T extends Record<string, TSchema>>(obj: TObject<T>) {
  const partial = Object.entries(obj.properties).reduce<Record<string, TOptional<TSchema>>>(
    (acc, [k, v]) => ((acc[k] = Type.Optional(v)), acc),
    {},
  );
  return { ...obj, ...Type.Object(partial) } as TObject<{ [K in keyof T]: TOptional<T[K]> }>;
}

export function Keys<T extends Record<string, TSchema>>(obj: TObject<T>) {
  return Object.keys(obj.properties) as (keyof T)[];
}

function TimestampTz(opts?: StringOptions<StringFormatOption>) {
  return Type.String({ description: 'generic PostgreSQL TIMESTAMPTZ data type', ...opts, format: 'date-time' });
}

function BigInt(opts?: StringOptions<StringFormatOption>) {
  return Type.String({ description: 'generic PostgreSQL BIGINT data type, handled as string in NodeJS', ...opts });
}

function Email(opts?: StringOptions<StringFormatOption>) {
  return Type.String({ ...opts, format: 'email' });
}

function Table<T extends Record<string, TSchema>>(table: string, columns: T, opts?: CustomOptions) {
  return Type.Object(columns, { ...opts, table });
}

export default {
  ListControl,
  Partial,
  Keys,
  TimestampTz,
  BigInt,
  Email,
  Table,
};

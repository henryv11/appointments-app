import { TLiteral, TObject, TOptional, TSchema, Type as T } from '@sinclair/typebox';
import { orderDirection } from './data-types';

export function ListControl<T extends string[]>(...orderByKeys: T) {
  return T.Object(
    {
      limit: T.Optional(T.Number()),
      offset: T.Optional(T.Number()),
      orderBy: T.Optional(
        T.Union(
          orderByKeys.map(key => T.Literal(key) as TLiteral<T[number]>),
          {
            description: 'Columns you can order by',
            type: 'string',
          },
        ),
      ),
      orderDirection: T.Optional(orderDirection),
    },
    { description: 'Generic database sorting and pagination options', type: 'string' },
  );
}

export function Partial<T extends Record<string, TSchema>>(obj: TObject<T>) {
  const partial = Object.entries(obj.properties).reduce<Record<string, TOptional<TSchema>>>(
    (acc, [k, v]) => ((acc[k] = T.Optional(v)), acc),
    {},
  );
  return { ...obj, ...T.Object(partial) } as TObject<{ [K in keyof T]: TOptional<T[K]> }>;
}

export function Keys<T extends Record<string, TSchema>>(obj: TObject<T>) {
  return Object.keys(obj.properties) as (keyof T)[];
}

import { fetch, FetchOptions } from './fetch';
import { join } from './path';

export const makeServiceFetch = (baseUrl: string) => <T>({
  path,
  token,
  headers = {},
  ...opts
}: FetchOptions & { path?: string | string[]; token?: string }) => (
  token && (headers['Authorization'] = `Bearer ${token}`),
  fetch<T>({ url: path ? join(baseUrl, ...new Array<string>().concat(path)) : baseUrl, headers, ...opts })
);

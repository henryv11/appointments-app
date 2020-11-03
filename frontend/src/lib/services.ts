import { SERVER_BASE_URL } from './constants';
import { fetch, FetchOptions } from './fetch';
import { join } from './path';

export const getServiceUrl = (...path: (string | undefined | null | false)[]) => join(SERVER_BASE_URL, ...path);

export const getServiceWebSocketUrl = (...path: (string | undefined | null | false)[]) =>
  getServiceUrl('ws', ...path).replace(/^(http:\/\/)/, 'ws://');

export function makeServiceFetch(...basePath: (string | undefined | null | false)[]) {
  const baseUrl = getServiceUrl(...basePath);
  return <T>({
    path,
    token,
    headers = {},
    ...opts
  }: FetchOptions & { path?: string | (string | undefined | null | false)[]; token?: string }) => {
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch<T>({
      url: path ? join(baseUrl, ...new Array<string | undefined | null | false>().concat(path)) : baseUrl,
      headers,
      ...opts,
    });
  };
}

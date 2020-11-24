import { SERVER_BASE_URL } from './constants';
import { fetch, FetchOptions } from './fetch';
import { join } from './path';

export const getServiceUrl = (...path: Parameters<typeof join>) => join(SERVER_BASE_URL, ...path);

export const getServiceWebSocketUrl = (...path: Parameters<typeof join>) =>
  getServiceUrl('ws', ...path).replace(/^(http:\/\/)/, 'ws://');

export function makeServiceFetch(...basePath: Parameters<typeof join>) {
  const baseUrl = getServiceUrl(...basePath);
  return <T>({
    path,
    token,
    headers = {},
    ...opts
  }: Omit<FetchOptions, 'url'> & { path?: string | Parameters<typeof join>; token?: string }) => {
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch<T>({
      url: path ? join(baseUrl, ...new Array<Parameters<typeof join>[0]>().concat(path)) : baseUrl,
      headers,
      ...opts,
    });
  };
}

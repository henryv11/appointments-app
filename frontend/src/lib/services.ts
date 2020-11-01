import { SERVER_BASE_URL } from './constants';
import { fetch, FetchOptions } from './fetch';
import { join } from './path';

export const getServiceUrl = (...path: string[]) => join(SERVER_BASE_URL, ...path);

export const getServiceWebSocketUrl = (...path: string[]) =>
  getServiceUrl('ws', ...path).replace(/^(http:\/\/)/, 'ws://');

export function makeServiceFetch(...basePath: string[]) {
  const baseUrl = getServiceUrl(...basePath);
  return <T>({ path, token, headers = {}, ...opts }: FetchOptions & { path?: string | string[]; token?: string }) => {
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch<T>({ url: path ? join(baseUrl, ...new Array<string>().concat(path)) : baseUrl, headers, ...opts });
  };
}

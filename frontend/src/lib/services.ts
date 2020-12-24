import { SERVER_BASE_URL, SERVER_WEBSOCKET_BASE_URL } from './constants';
import { fetch, FetchOptions } from './fetch';
import { join } from './path';

export function getServiceUrl(...path: PathJoinParameters) {
  return join(SERVER_BASE_URL, 'backend', ...path);
}

export function getServiceWebSocketUrl(...path: PathJoinParameters) {
  return join(SERVER_WEBSOCKET_BASE_URL, 'ws', ...path);
}

export function createServiceFetch(...basePath: PathJoinParameters) {
  const baseUrl = getServiceUrl(...basePath);
  return <T>({
    path,
    token,
    headers = {},
    ...opts
  }: Omit<FetchOptions, 'url'> & { path?: string | Parameters<typeof join>; token?: string } = {}) => {
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch<T>({
      url: path ? join(baseUrl, ...new Array<PathJoinParameters[number]>().concat(path)) : baseUrl,
      headers,
      ...opts,
    });
  };
}

type PathJoinParameters = Parameters<typeof join>;

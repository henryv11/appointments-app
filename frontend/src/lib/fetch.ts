import { join } from './path';

export const makeFetch = (baseUrl: string) => <T>({ path, ...opts }: FetchOptions & { path?: string | string[] }) =>
  _fetch<T>({ url: path ? join(baseUrl, ...([] as string[]).concat(path)) : baseUrl, ...opts });

export { _fetch as fetch };

async function _fetch<T>({
  headers = {},
  body,
  url,
  query,
  ...opts
}: FetchOptions & { url: string }): Promise<FetchResponse<T>> {
  if (body !== undefined && typeof body !== 'string') {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(query ? url + '?' + new URLSearchParams(query as never).toString() : url, {
    ...opts,
    body,
    headers,
  });
  if (res.status >= 400) throw new FetchError(res);
  return res;
}

class FetchError extends Error {
  status: number;
  statusText: string;
  url: string;
  name = FetchError.name;
  constructor(res: Response) {
    super(`request to ${res.url} failed`);
    this.status = res.status;
    this.statusText = res.statusText;
    this.url = res.url;
  }
}

interface FetchResponse<T> extends Omit<Response, 'json'> {
  json: () => Promise<T>;
}

interface FetchOptions extends Omit<RequestInit, 'body' | 'query' | 'headers'> {
  body?: any;
  query?: Record<string, string | number | string[] | number[] | boolean | boolean[]>;
  headers?: Record<string, string>;
}

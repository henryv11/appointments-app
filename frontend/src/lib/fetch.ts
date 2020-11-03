export { _fetch as fetch };
import { ParsedUrlQueryInput, stringify } from 'querystring';

async function _fetch<T>({
  headers = {},
  body,
  url,
  query,
  ...opts
}: FetchOptions & { url: string }): Promise<FetchResponse<T>> {
  if (body && typeof body === 'object') (body = JSON.stringify(body)), (headers['Content-Type'] = 'application/json');
  const res = await fetch(query ? url + '?' + stringify(query) : url, {
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

export interface FetchOptions extends Omit<RequestInit, 'body' | 'query' | 'headers'> {
  body?: any;
  query?: ParsedUrlQueryInput;
  headers?: Record<string, string>;
}

import { join } from './path';
import { stringify } from './query';

export const makeFetch = (baseUrl: string) => <T>({ path, ...opts }: FetchOptions & { path?: string }) =>
  _fetch<T>({ url: path ? join(baseUrl, path) : baseUrl, ...opts });

export { _fetch as fetch };

function _fetch<T>({ headers = {}, url, ...opts }: FetchOptions & { url: string }) {
  if (opts.body !== undefined && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
    headers['Content-Type'] = 'application/json';
  }
  return fetch(opts.query ? join(url, stringify(opts.query)) : url, opts).then(res => {
    if (res.status >= 400) throw new FetchError(res);
    return res as Omit<typeof res, 'json'> & { json: () => Promise<T> };
  });
}

class FetchError extends Error {
  status: number;
  statusText: string;
  url: string;
  constructor(res: Response) {
    super(`request to ${res.url} failed`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this);
    this.status = res.status;
    this.statusText = res.statusText;
    this.url = res.url;
  }
}

type FetchOptions = Omit<RequestInit, 'body' | 'query' | 'headers'> & {
  body?: any;
  query?: Record<string, string | number | string[] | number[]>;
  headers?: Record<string, string>;
};

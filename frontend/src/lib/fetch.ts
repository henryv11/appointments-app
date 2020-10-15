import { join } from './path';

type FetchOptions = Omit<RequestInit, 'body' | 'query' | 'headers'> & {
  body?: any;
  query?: Record<string, string | number | string[] | number[]>;
  headers?: Record<string, string>;
};

class FetchError extends Error {
  status: number;
  statusText: string;
  url: string;
  constructor(res: Response) {
    super(`request to ${res.url} failed`);
    this.status = res.status;
    this.statusText = res.statusText;
    this.url = res.url;
  }
}

function querystringify(object: Record<string, any>) {
  return Object.entries(object).reduce((query, [key, value]) => {}, '');
}

function _fetch(url: string, opts: FetchOptions) {
  if (opts.body !== undefined && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
    opts.headers['Content-Type'] = 'application/json';
  }
  return fetch(join(...[url, opts.query && querystringify(opts.query)].filter(Boolean)), opts).then(res => {
    if (res.status >= 400) throw new FetchError(res);
    return res;
  });
}

export function makeFetch(baseUrl: string) {
  return function (path: string, opts: FetchOptions) {
    return _fetch(join(baseUrl, path), opts);
  };
}

export { _fetch as fetch };

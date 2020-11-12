import { useEffect, useState } from 'react';

type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;

export function useAsync<
  F extends (...args: R) => Promise<G>,
  G extends ReturnType<F>,
  R extends unknown[],
  T = G extends Promise<infer R> ? R : G
>(asyncFn?: F, ...args: R) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<G>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (!asyncFn) return;
    let isCancelled = false;
    setResult(undefined);
    setError(undefined);
    setIsLoading(true);
    asyncFn(...args).then(
      result => (isCancelled ? void 0 : (setResult(result), setIsLoading(false))),
      error =>
        isCancelled
          ? void 0
          : (setError(error || new Error('useAsync hook callback rejected with unknown error')), setIsLoading(false)),
    );
    return () => ((isCancelled = true), setIsLoading(false));
  }, [asyncFn, ...args]);

  return [isLoading, result, error] as UseAsyncState<T>;
}

type IdleState = [false, undefined, undefined];

type LoadingState = [true, undefined, undefined];

type RejectedState = [false, undefined, Error];

type ResolvedState<T> = [false, T, undefined];

type UseAsyncState<T> = IdleState | LoadingState | RejectedState | ResolvedState<T>;

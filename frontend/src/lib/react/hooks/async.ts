import { useEffect, useRef } from 'react';
import { useSimpleReducer } from './simple-reducer';

export function useAsync<
  F extends (...args: R) => Promise<unknown>,
  R extends unknown[],
  T = ReturnType<F> extends Promise<infer R> ? R : ReturnType<F>
>(asyncFn?: F, ...args: R) {
  const abortController = useRef<() => void>();
  const callbackRef = useRef<F>();
  const [{ promiseState, result, error }, setState] = useSimpleReducer<{
    promiseState: PromiseState;
    result?: T;
    error?: Error;
  }>({
    promiseState: PromiseState.IDLE,
  });

  useEffect(() => {
    callbackRef.current = asyncFn;
  }, [asyncFn]);

  useEffect(() => {
    if (!callbackRef.current) return;
    abortController.current?.();
    let isAborted = false;
    abortController.current = () => (
      (isAborted = true),
      setState({ result: undefined, error: undefined, promiseState: PromiseState.IDLE }),
      (abortController.current = undefined)
    );
    setState({ promiseState: PromiseState.PENDING });
    callbackRef
      .current(...args)
      .then(result => !isAborted && setState({ result: result as T, promiseState: PromiseState.RESOLVED }))
      .catch(
        error =>
          !isAborted &&
          setState({
            error: error || new Error('useAsync function rejected with an undefined error'),
            promiseState: PromiseState.REJECTED,
          }),
      )
      .finally(() => !isAborted && (abortController.current = undefined));
    return abortController.current;
  }, args);

  return {
    isIdle: promiseState === PromiseState.IDLE,
    isPending: promiseState === PromiseState.PENDING,
    isRejected: promiseState === PromiseState.REJECTED,
    isResolved: promiseState === PromiseState.RESOLVED,
    error,
    result,
    abort: abortController.current,
  } as UseAsyncState<T>;
}

enum PromiseState {
  IDLE,
  PENDING,
  RESOLVED,
  REJECTED,
}

interface UseAsyncStateBase<IsIdle = true, IsPending = false, IsRejected = false, IsResolved = false> {
  isIdle: IsIdle;
  isPending: IsPending;
  isRejected: IsRejected;
  isResolved: IsResolved;
}

interface IdleState extends UseAsyncStateBase {}

interface LoadingState extends UseAsyncStateBase<false, true> {
  abort: () => void;
}

interface RejectedState extends UseAsyncStateBase<false, false, true> {
  error: Error;
}

interface ResolvedState<T> extends UseAsyncStateBase<false, false, false, true> {
  result: T;
}

type UseAsyncState<T> = IdleState | LoadingState | RejectedState | ResolvedState<T>;

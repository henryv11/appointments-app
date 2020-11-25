import { useEffect, useRef } from 'react';
import { useSimpleReducer } from './simple-reducer';

export function useAsync<
  F extends (...args: R) => Promise<unknown>,
  R extends unknown[],
  T = ReturnType<F> extends Promise<infer R> ? R : ReturnType<F>
>(asyncFn: F | undefined | boolean, args: R = ([] as unknown) as R) {
  const abortController = useRef<() => void>(noop);
  const [{ promiseState, result, error }, setState] = useSimpleReducer<{
    promiseState: PromiseState;
    result?: T;
    error?: Error;
  }>({
    promiseState: PromiseState.IDLE,
  });

  useEffect(() => {
    if (typeof asyncFn !== 'function') return;
    abortController.current();
    let isAborted = false;
    abortController.current = () => {
      isAborted = true;
      abortController.current = noop;
      setState({ result: undefined, error: undefined, promiseState: PromiseState.IDLE });
    };
    setState({ promiseState: PromiseState.PENDING });
    asyncFn(...args)
      .then(result => {
        if (!isAborted) setState({ result: result as T, error: undefined, promiseState: PromiseState.RESOLVED });
      })
      .catch(error => {
        if (!isAborted)
          setState({
            result: undefined,
            error: error || new Error('useAsync function rejected with an unknown error'),
            promiseState: PromiseState.REJECTED,
          });
      })
      .finally(() => (abortController.current = noop));
    return abortController.current;
  }, args);

  return {
    isIdle: promiseState === PromiseState.IDLE,
    isPending: promiseState === PromiseState.PENDING,
    isRejected: promiseState === PromiseState.REJECTED,
    isResolved: promiseState === PromiseState.RESOLVED,
    state: promiseState,
    error,
    result,
    abort: abortController.current,
  } as UseAsyncState<T>;
}

function noop() {}

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
  state: PromiseState;
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

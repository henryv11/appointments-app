import { useEffect, useRef } from 'react';
import { useSimpleReducer } from './simple-reducer';

export function useAsync<
  F extends (...args: Args) => Promise<unknown>,
  Args extends unknown[],
  Result = ReturnType<F> extends Promise<infer R> ? R : ReturnType<F>
>(asyncFn: F | undefined | false, args: Args = ([] as unknown) as Args) {
  const abortController = useRef<() => void>(noop);
  const [{ promiseState, result, error }, setState] = useSimpleReducer<{
    promiseState: PromiseState;
    result?: Result;
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
      .then((result: Result) => {
        if (!isAborted) setState({ result, error: undefined, promiseState: PromiseState.RESOLVED });
      })
      .catch((error: Error) => {
        if (!isAborted)
          setState({
            result: undefined,
            error,
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
  } as UseAsyncState<Result>;
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

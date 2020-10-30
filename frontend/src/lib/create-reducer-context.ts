import { createContext, createElement, Dispatch, PropsWithChildren, Reducer, useContext, useReducer } from 'react';

export function createReducerContext<T, D>(
  initialState: T,
  reducer: Reducer<T, D>,
  displayName?: string,
): [typeof Provider, typeof context['Consumer'], typeof _useContext] {
  const context = createContext([
    initialState,
    () => {
      throw new Error(`you need to provide for "${displayName || 'unknown'}" context first in order to dispatch`);
    },
  ] as [T, Dispatch<D>]);
  if (displayName) context.displayName = displayName;
  const _useContext = () => useContext(context);
  const Provider = ({ children, ...overrides }: PropsWithChildren<Partial<T>>) =>
    createElement(context.Provider, { value: useReducer(reducer, { ...initialState, ...overrides }) }, children);
  return [Provider, context.Consumer, _useContext];
}

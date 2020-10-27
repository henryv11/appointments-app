import React, { createContext, Dispatch, PropsWithChildren, Reducer, useContext, useReducer } from 'react';

export default function MakeContext<T, D>(
  initialState: T,
  reducer: Reducer<T, D>,
): [typeof Provider, typeof _useContext] {
  const context = createContext([
    initialState,
    () => {
      throw new Error('you need to provide for this context in order to dispatch');
    },
  ] as [T, Dispatch<D>]);
  const _useContext = () => useContext(context);
  const Provider = ({ children, ...overrides }: PropsWithChildren<Partial<T>>) => (
    <context.Provider value={useReducer(reducer, { ...initialState, ...overrides })}>{children}</context.Provider>
  );
  return [Provider, _useContext];
}

import React, { createContext, Dispatch, PropsWithChildren, Reducer, useContext, useReducer } from 'react';

export default function MakeContext<T, D>(
  initialState: T,
  reducer: Reducer<T, D>,
): [(props: PropsWithChildren<Partial<T>>) => JSX.Element, () => [T, Dispatch<D>]] {
  const context = createContext([
    initialState,
    () => {
      throw new Error('you need to provide for this context');
    },
  ] as [T, Dispatch<D>]);
  return [
    ({ children, ...overrides }: PropsWithChildren<Partial<T>>) => (
      <context.Provider value={useReducer(reducer, { ...initialState, ...overrides })}>{children}</context.Provider>
    ),
    () => useContext(context),
  ];
}

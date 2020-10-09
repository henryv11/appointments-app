import React, { Context, createContext, Dispatch, PropsWithChildren, Reducer, useContext, useReducer } from 'react';

export function buildContext<T, D>(
    initialState: T,
    reducer: Reducer<T, D>,
): [(props: PropsWithChildren<Partial<T>>) => JSX.Element, () => [T, Dispatch<D>]] {
    const context: Context<[T, Dispatch<D>]> = createContext(undefined);
    return [
        ({ children, ...overrides }: PropsWithChildren<Partial<T>>) => (
            <context.Provider value={useReducer(reducer, { ...initialState, ...overrides })}>
                {children}
            </context.Provider>
        ),
        () => useContext(context),
    ];
}

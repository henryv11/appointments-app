import { useState } from 'react';

export function useSimpleReducer<T>(initialState: T, log?: boolean) {
  const [state, setState] = useState(initialState);
  const updateState = !log
    ? (updates?: Partial<T>) => setState({ ...state, ...updates })
    : (updates?: Partial<T>) => (console.log('updating state', { state, updates }), setState({ ...state, ...updates }));
  return [state, updateState] as const;
}

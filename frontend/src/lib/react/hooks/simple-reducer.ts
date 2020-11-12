import { useReducer } from 'react';

export function useSimpleReducer<T>(initialState: T) {
  return useReducer((state: T, updates: Partial<T>) => ({ ...state, ...updates }), initialState);
}

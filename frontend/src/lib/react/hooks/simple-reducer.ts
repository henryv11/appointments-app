import { useState } from 'react';

export function useSimpleReducer<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  return [state, (updates?: Partial<T>) => setState({ ...state, ...updates })] as const;
}

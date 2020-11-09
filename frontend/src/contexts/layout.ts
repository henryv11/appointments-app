import { createReducerContext } from '@/lib/react/create-reducer-context';

export const [LayoutContextProvider, LayoutContextConsumer, useLayoutContext] = createReducerContext(
  { isSidebarOpen: true },
  (state: LayoutState, action: LayoutAction) => {
    switch (action.type) {
      case 'OPEN_SIDEBAR':
        return { ...state, isSidebarOpen: true };

      case 'CLOSE_SIDEBAR':
        return { ...state, isSidebarOpen: false };

      case 'TOGGLE_SIDEBAR':
        return { ...state, isSidebarOpen: !state.isSidebarOpen };
    }
  },
);

interface LayoutState {
  isSidebarOpen: boolean;
}

type LayoutAction = { type: 'OPEN_SIDEBAR' | 'CLOSE_SIDEBAR' | 'TOGGLE_SIDEBAR' };

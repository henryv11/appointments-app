import { createReducerContext } from '@/lib/create-reducer-context';

const [LayoutContextProvider, LayoutContextConsumer, useLayoutContext] = createReducerContext(
  { isSidebarOpen: true },
  (state: LayoutState, action: LayoutAction) => {
    switch (action.type) {
      case 'OPEN_SIDEBAR':
        return { ...state, isSidebarOpen: true };

      case 'CLOSE_SIDEBAR':
        return { ...state, isSidebarOpen: false };
    }
  },
);

interface LayoutState {
  isSidebarOpen: boolean;
}

type LayoutAction = { type: 'OPEN_SIDEBAR' | 'CLOSE_SIDEBAR' };

export { LayoutContextProvider, LayoutContextConsumer, useLayoutContext };

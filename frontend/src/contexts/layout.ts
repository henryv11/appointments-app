import { createReducerContext } from '@/lib/react/create-reducer-context';

const [LayoutContextProvider, LayoutContextConsumer, useLayoutContext] = createReducerContext(
  { isSidebarOpen: true },
  (state: LayoutState, action: LayoutAction) => {
    switch (action.type) {
      case LayoutContextActionType.OPEN_SIDEBAR:
        return { ...state, isSidebarOpen: true };

      case LayoutContextActionType.CLOSE_SIDEBAR:
        return { ...state, isSidebarOpen: false };

      case LayoutContextActionType.TOGGLE_SIDEBAR:
        return { ...state, isSidebarOpen: !state.isSidebarOpen };
    }
  },
);

export { LayoutContextProvider, LayoutContextConsumer, useLayoutContext };

export enum LayoutContextActionType {
  OPEN_SIDEBAR,
  CLOSE_SIDEBAR,
  TOGGLE_SIDEBAR,
}

interface LayoutState {
  isSidebarOpen: boolean;
}

type LayoutAction = { type: LayoutContextActionType };

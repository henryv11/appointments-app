import MakeContext from '../higher-order-components/MakeContext';

const [LayoutContextProvider, useLayoutContext] = MakeContext(
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

export { LayoutContextProvider, useLayoutContext };

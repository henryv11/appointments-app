import BuildContext from '../higher-order-components/BuildContext';

const [LayoutContextProvider, useLayoutContext] = BuildContext(
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

type LayoutState = { isSidebarOpen: boolean };

type LayoutAction = { type: 'OPEN_SIDEBAR' | 'CLOSE_SIDEBAR' };

export { LayoutContextProvider, useLayoutContext };

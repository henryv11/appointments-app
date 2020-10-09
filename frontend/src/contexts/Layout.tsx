import { buildContext } from '../higher-order/Build';

const [LayoutContextProvider, useLayoutContext] = buildContext(
    { isSidebarOpen: true },
    (state, { type }: { type: 'OPEN_SIDEBAR' | 'CLOSE_SIDEBAR' }) => {
        switch (type) {
            case 'OPEN_SIDEBAR':
                return { ...state, isSidebarOpen: true };
            case 'CLOSE_SIDEBAR':
                return { ...state, isSidebarOpen: false };
            default:
                throw Error(`invalid action type "${type}" for layoutContextDispatch`);
        }
    },
);

export { LayoutContextProvider, useLayoutContext };

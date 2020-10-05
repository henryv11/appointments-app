import React from 'react';

const layoutState = {
  isSidebarOpen: false,
};

export const layoutContext = React.createContext(layoutState);

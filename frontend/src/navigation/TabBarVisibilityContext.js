import React, { createContext, useContext, useMemo, useState } from 'react';

const TabBarVisibilityContext = createContext({
  visible: true,
  setVisible: () => {},
});

export function TabBarVisibilityProvider({ children }) {
  const [visible, setVisible] = useState(true);
  const value = useMemo(() => ({ visible, setVisible }), [visible]);

  return (
    <TabBarVisibilityContext.Provider value={value}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  return useContext(TabBarVisibilityContext);
}

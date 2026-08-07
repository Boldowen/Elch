import { useCallback, useEffect, useRef } from 'react';
import { useTabBarVisibility } from './TabBarVisibilityContext';

export function useHideTabBarOnScroll() {
  const { setVisible } = useTabBarVisibility();
  const lastScrollY = useRef(0);

  const updateVisibility = useCallback((visible) => {
    setVisible(visible);
  }, [setVisible]);

  useEffect(() => () => setVisible(true), [setVisible]);

  return useCallback((event) => {
    const nextY = Math.max(0, event.nativeEvent.contentOffset.y);
    const delta = nextY - lastScrollY.current;

    if (nextY <= 12) updateVisibility(true);
    else if (nextY > 48 && delta > 6) updateVisibility(false);
    else if (delta < -6) updateVisibility(true);

    lastScrollY.current = nextY;
  }, [updateVisibility]);
}

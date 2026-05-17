import React from 'react';

export const useElementRect = (element: HTMLElement | null) => {
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  React.useLayoutEffect(() => {
    if (!element) {
      setRect(null);
      return;
    }

    const update = () => {
      setRect(element.getBoundingClientRect());
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [element]);

  return rect;
};

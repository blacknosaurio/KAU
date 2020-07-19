import { useEffect, useRef } from 'react';

export default function useEventListener(eventName, handler, element = window) {
  // We save the evetn handler
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Set the js listener
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      const eventListener = event => savedHandler.current(event);

      // We add the listener
      element.addEventListener(eventName, eventListener);

      // And lastly, we remove the listener
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Getting the changes!!
  );
}

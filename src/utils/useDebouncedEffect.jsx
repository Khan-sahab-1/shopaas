// src/hooks/useDebouncedEffect.js
import {useEffect} from 'react';

export default function useDebouncedEffect(effect, deps, delay = 500) {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

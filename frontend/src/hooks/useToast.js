import { useState, useEffect, useCallback } from 'react';

/**
 * Global toast hook that listens for API errors and manual triggers.
 * Returns { toasts, addToast, removeToast }
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'error') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Listen for API errors dispatched by the Axios interceptor
  useEffect(() => {
    const handler = (e) => {
      addToast(e.detail.message, 'error');
    };
    window.addEventListener('dailyforge:apierror', handler);
    return () => window.removeEventListener('dailyforge:apierror', handler);
  }, [addToast]);

  return { toasts, addToast, removeToast };
}

import { useState, useEffect } from "react";

/**
 * useDebounce hook
 * ----------------
 * This hook delays updating the returned value until after
 * the user stops changing it for the specified delay time.
 *
 */

function useDebounce(value, delay = 2000) {
  // Keep track of the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer: after 2000 ms, update debouncedValue
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: if `value` changes again before the delay finishes,
    // clear the old timer and start a new one.
    // This ensures only the last change within the delay period is used.
    return () => {
      clearTimeout(handler);
    };
  }, [value]);
  // Effect re-runs whenever `value` changes.
  
  // Return the debounced value
  return debouncedValue;
}

export default useDebounce;

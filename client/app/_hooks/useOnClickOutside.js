import { useEffect, useRef } from 'react'

// Custom hook for handling clicks outside of a given element
// Useful for dropdowns, modals, tooltips, etc.

export const useOnClickOutside = (handler, when = true) => {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event)
      }
    }

    if (when) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handler, when])

  return ref
}

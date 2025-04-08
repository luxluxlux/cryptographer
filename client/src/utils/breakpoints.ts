import { useEffect, useState } from 'react'

// Bootstrap breakpoints as a reliable reference
// https://getbootstrap.com/docs/5.0/layout/breakpoints/
export const enum BREAKPOINT {
    S = 576,
}

/**
 * React hook to observe the screen size
 * Warning! Only for client side use
 * TODO: Try to use MUI breakpoints
 * @returns 
 */
export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    function handleSize() {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }

    useEffect(() => {
        window.addEventListener('resize', handleSize)
        return () => {
            window.removeEventListener('resize', handleSize)
        }
    }, [handleSize])

    return windowSize;
}

/**
 * React hook to observe the screen size and check if the width is more than the breakpoint
 * Warning! Only for client side use
 * @param breakpoint The size of the screen
 */
export function useBreakpoint(breakpoint: BREAKPOINT) {
    return useWindowSize().width > breakpoint;
}
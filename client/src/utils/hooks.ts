import { useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

// TODO: Try to get rid of the location in the dependencies
/**
 * Updates the search parameters of the current URL.
 * @returns The functions to set and remove the search parameters.
 */
export function useUpdateSearchParams() {
    const location = useLocation();
    const [, setSearchParams] = useSearchParams();

    const setParam = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(location.search);
        if (params.get(name) !== value) {
            params.set(name, value);
            setSearchParams(params, { state: location.state });
        }
    }, [location]);

    const removeParam = useCallback((name: string) => {
        const params = new URLSearchParams(location.search);
        if (params.has(name)) {
            params.delete(name);
            setSearchParams(params, { state: location.state });
        }
    }, [location]);

    return { setParam, removeParam };
}

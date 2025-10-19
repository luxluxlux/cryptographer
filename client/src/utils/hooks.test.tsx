import { BrowserRouter } from 'react-router-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useUpdateSearchParams } from './hooks';

// FIXME: Fix test act warning
describe('useUpdateSearchParams', () => {
    it('Should set search parameter', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <BrowserRouter>{children}</BrowserRouter>
        );
        const { result } = renderHook(() => useUpdateSearchParams(), { wrapper });
        const { setParam } = result.current;
        const name = 'test';
        const value = 'value';

        setParam(name, value);

        await waitFor(() => expect(window.location.search).toContain(`${name}=${value}`));
    });

    it('Should remove search parameter', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <BrowserRouter>{children}</BrowserRouter>
        );
        const { result } = renderHook(() => useUpdateSearchParams(), { wrapper });
        const { removeParam } = result.current;
        const name = 'test';
        const value = 'value';

        window.history.pushState({}, '', `?${name}=${value}`);

        removeParam(name);

        await waitFor(() => expect(window.location.search).not.toContain(`${name}=${value}`));
    });
});

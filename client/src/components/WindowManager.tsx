import { useState, useCallback, useMemo, useRef, useEffect, memo, ReactNode } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { IWindowManagerContext } from 'utils/interfaces';
import { WindowManagerContext } from 'utils/contexts';

interface IProps {
    children: ReactNode;
}

interface IState {
    content: ReactNode | null;
    modal: boolean;
    fullscreen: boolean;
}

// TODO: Close if page changed
function WindowManager(props: IProps) {
    const closableRef = useRef(true);

    const [state, setState] = useState<IState>({
        content: null,
        modal: false,
        fullscreen: false,
    });

    const close = useCallback(() => {
        setState((prev) => ({ ...prev, content: null }));
    }, []);

    const stateContextValue = useMemo<IWindowManagerContext>(
        () => ({
            open: (content, options) => {
                closableRef.current = options?.closable ?? true;
                setState({
                    content: content,
                    modal: !!options?.modal,
                    fullscreen: !!options?.fullscreen,
                });
            },
            close,
        }),
        [close]
    );

    const handleClose = useCallback(() => {
        if (closableRef.current) {
            close();
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && closableRef.current) {
                close();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [close]);

    return (
        <WindowManagerContext.Provider value={stateContextValue}>
            {props.children}
            {/* TODO: Use cross button for close */}
            <Backdrop
                className={state.modal ? 'window-manager_modal' : undefined}
                open={!!state.content}
                onClick={handleClose}
            >
                {/* TODO: Adapt fullscreen to non-modal mode */}
                {state.fullscreen ? (
                    state.content
                ) : (
                    <div className="window-manager__content">
                        <div className="window-manager__content-container">
                            <div className="window-manager__content-container-scroll">
                                {state.content}
                            </div>
                        </div>
                    </div>
                )}
            </Backdrop>
        </WindowManagerContext.Provider>
    );
}

WindowManager.displayName = 'WindowManager';

export default memo(WindowManager);

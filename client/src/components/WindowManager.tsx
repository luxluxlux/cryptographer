import { useState, useCallback, useMemo, useRef, memo, ReactNode } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { WindowManagerContext } from 'utils/windows';

interface IProps {
    children: ReactNode;
}

// TODO Consider definition instead of istance
// TODO Close if page changed
function WindowManager(props: IProps) {
    const closableRef = useRef(true);

    const [content, setContent] = useState<ReactNode>(null);
    const [modal, setModal] = useState(false);

    const stateContextValue = useMemo(
        () => ({
            open: (content: ReactNode, modal?: boolean, closable: boolean = true) => {
                closableRef.current = closable;
                setModal(!!modal);
                setContent(content);
            },
            close: () => {
                setContent(null);
            },
        }),
        []
    );

    const handleClose = useCallback(() => {
        if (closableRef.current) {
            setContent(null);
        }
    }, []);

    return (
        <WindowManagerContext.Provider value={stateContextValue}>
            {props.children}
            {/* TODO Use cross button for close */}
            <Backdrop
                className={modal ? 'window-manager_modal' : undefined}
                open={!!content}
                onClick={handleClose}
            >
                <div className="window-manager__content">{content}</div>
            </Backdrop>
        </WindowManagerContext.Provider>
    );
}

WindowManager.displayName = 'WindowManager';

export default memo(WindowManager);

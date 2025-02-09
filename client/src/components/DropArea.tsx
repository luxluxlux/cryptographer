import { ReactNode, memo, useContext, useCallback, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { validateFiles } from 'utils/common';
import { WindowManagerContext } from 'utils/contexts';
import DragNDrop from 'windows/DragNDrop';

interface IProps {
    children: ReactNode;
}

const DropArea = (props: IProps) => {
    const navigate = useNavigate();
    const windowContext = useContext(WindowManagerContext);

    const handleDrop = useCallback(
        (files: FileList) => {
            const validation = validateFiles(files);
            if (validation !== true) {
                enqueueSnackbar(validation, { variant: 'warning' });
                return;
            }
            const file = files[0];
            navigate('/password', { state: { file } });
        },
        [navigate, windowContext.open]
    );

    const handleDragEnter = useCallback(
        (event: DragEvent<HTMLElement>) => {
            // Handle only file drag
            const types = event.dataTransfer.types;
            if (types?.length !== 1 || types?.[0] !== 'Files') {
                return;
            }
            windowContext.open(<DragNDrop onDrop={handleDrop} />, {
                modal: true,
                fullscreen: true,
                closable: false,
            });
        },
        [handleDrop, windowContext.open]
    );

    return <div onDragEnter={handleDragEnter}>{props.children}</div>;
};

DropArea.displayName = 'DropArea';

export default memo(DropArea);

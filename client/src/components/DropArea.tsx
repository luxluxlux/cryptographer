import { ReactNode, memo, useContext, useCallback, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'components/Snackbar';
import { MAX_ALERT_FILENAME_LENGTH } from 'utils/constants';
import { ellipse, validateFiles } from 'utils/common';
import { WindowManagerContext } from 'utils/contexts';
import DragNDrop from 'windows/DragNDrop';

interface IProps {
    children: ReactNode;
}

const DropArea = (props: IProps) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const windowContext = useContext(WindowManagerContext);

    const handleDrop = useCallback(
        (files: FileList) => {
            const validation = validateFiles(files);
            if (validation !== true) {
                enqueueSnackbar({
                    variant: 'warning',
                    title: 'Unable to upload file',
                    message:
                        files.length === 1 ? (
                            <>
                                <strong>{ellipse(files[0].name, MAX_ALERT_FILENAME_LENGTH)}</strong>{' '}
                                isn&apos;t uploaded. {validation}
                            </>
                        ) : (
                            validation
                        ),
                });
                return;
            }
            navigate('/password', { state: { file: files[0] } });
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

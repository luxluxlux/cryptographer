import { useCallback, useContext, useRef, DragEvent } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { MAX_FILE_SIZE_MB } from 'utils/constants';
import { WindowManagerContext } from 'utils/windows';

interface IProps {
    onDrop?: (files: FileList) => void;
}

const DragNDrop = (props: IProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const windowContext = useContext(WindowManagerContext);

    const handleDrop = useCallback(
        (event: DragEvent<HTMLElement>) => {
            // Prevent file from being opened
            event.preventDefault();
            props.onDrop?.(event.dataTransfer.files);
            windowContext.close();
        },
        [props.onDrop]
    );

    const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
        // Prevent file from being opened
        event.preventDefault();
    }, []);

    const handleDragLeave = useCallback(
        (event: DragEvent<HTMLElement>) => {
            if (rootRef.current && !rootRef.current.contains(event.relatedTarget as Node)) {
                windowContext.close();
            }
        },
        [windowContext.close]
    );

    return (
        <div
            ref={rootRef}
            className="drag-n-drop"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <div className="drag-n-drop__content">
                <FileUploadIcon fontSize="large" />
                <div className="drag-n-drop__content-title">{'Drop file here'}</div>
                <div>{`One file of any extension no more than ${MAX_FILE_SIZE_MB} MB`}</div>
            </div>
        </div>
    );
};

DragNDrop.displayName = 'DragNDrop';

export default DragNDrop;

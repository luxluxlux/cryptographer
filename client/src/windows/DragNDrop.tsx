import { useCallback, useContext, useRef, DragEvent, memo } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { MAX_FILES_SIZE_MB } from 'utils/constants';
import { WindowManagerContext } from 'components/WindowManager';

/**
 * The properties for the file drop zone.
 */
export interface IProps {
    /**
     * Callback for file drop.
     * @param files The dropped files.
     */
    onDrop?: (files: FileList) => void;
}

// TODO: Rename to FileDrop
/**
 * File drop area.
 * @param props The properties for the file drop zone.
 * @returns File drop area.
 */
export const DragNDrop = (props: IProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const windowContext = useContext(WindowManagerContext);

    const handleDrop = useCallback(
        (event: DragEvent<HTMLElement>) => {
            // Prevent file from being opened
            event.preventDefault();
            props.onDrop?.(event.dataTransfer.files);
            windowContext.close();
        },
        [props.onDrop, windowContext.close]
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
                <div>One file of any extension no more than {MAX_FILES_SIZE_MB}&nbsp;MB</div>
            </div>
        </div>
    );
};

DragNDrop.displayName = 'DragNDrop';

export default memo(DragNDrop);

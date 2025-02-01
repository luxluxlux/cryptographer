import { memo, useLayoutEffect, useRef, useState } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Connector = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const [enabled, setEnabled] = useState(false);

    useLayoutEffect(() => {
        // Dirty hack to get the state of the particular connector
        setEnabled(!!rootRef.current?.previousElementSibling?.classList.contains('Mui-completed'));
    });

    return (
        <div ref={rootRef} className="stage-connector">
            <NavigateNextIcon fontSize="small" color={enabled ? 'inherit' : 'disabled'} />
        </div>
    );
};

Connector.displayName = 'Connector';

export default memo(Connector);

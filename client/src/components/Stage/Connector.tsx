import { memo } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Connector = () => (
    <div className="stage-connector">
        <NavigateNextIcon />
    </div>
);

Connector.displayName = 'Connector';

export default memo(Connector);

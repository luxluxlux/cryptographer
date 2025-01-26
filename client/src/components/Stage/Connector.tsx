import { memo } from 'react';
import arrow from 'resources/arrow.svg';

const Connector = () => (
    <div className="stage-connector">
        {/* TODO Use MUI arrow icon */}
        <img src={arrow} />
    </div>
);

Connector.displayName = 'Connector';

export default memo(Connector);

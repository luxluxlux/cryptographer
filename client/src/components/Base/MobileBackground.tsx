import { memo } from 'react';

const MobileBackground = () => {
    return (
        <div className="mobile-background">
            <div className="mobile-background__figure" />
            <div className="mobile-background__overlay" />
        </div>
    );
};

MobileBackground.displayName = 'MobileBackground';

export default memo(MobileBackground);

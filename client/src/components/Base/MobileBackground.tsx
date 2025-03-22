import { memo } from 'react';

interface IProps {
    color: string;
}

const MobileBackground = (props: IProps) => {
    return (
        <div className="mobile-background">
            <div className="mobile-background__figure" />
            <div
                className="mobile-background__overlay"
                style={{
                    backgroundColor: props.color,
                }}
            />
        </div>
    );
};

MobileBackground.displayName = 'MobileBackground';

export default memo(MobileBackground);

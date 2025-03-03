import { memo } from 'react';

interface IProps {
    color: string;
}

const DesktopBackground = (props: IProps) => (
    <div className="desktop-background">
        <div className="desktop-background__gradient">
            <div className="desktop-background__gradient-left" />
            <div className="desktop-background__gradient-right" />
        </div>
        <div className="desktop-background__blur" />
        <div className="desktop-background__glow" />
        <div
            className="desktop-background__overlay"
            style={{
                backgroundColor: props.color,
            }}
        />
    </div>
);

DesktopBackground.displayName = 'DesktopBackground';

export default memo(DesktopBackground);

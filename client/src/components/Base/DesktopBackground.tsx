const DesktopBackground = () => (
    <div className="desktop-background">
        <div className="desktop-background__gradient">
            <div className="desktop-background__gradient-left" />
            <div className="desktop-background__gradient-right" />
        </div>
        <div className="desktop-background__blur" />
        <div className="desktop-background__glow" />
        <div className="desktop-background__overlay" />
    </div>
);

DesktopBackground.displayName = 'DesktopBackground';

export default DesktopBackground;

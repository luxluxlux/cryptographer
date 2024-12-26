import { ReactNode, memo } from 'react';
import { useLocation } from 'react-router-dom';
import WindowManager from 'components/WindowManager';
import { PATH, PATH_STAGE, STAGE_DATA } from 'utils/constants';

interface IProps {
    logo: ReactNode;
    menu: ReactNode;
    footer: ReactNode;
    stage: ReactNode;
    content: ReactNode;
}

const Base = (props: IProps) => {
    const location = useLocation();
    const stage = PATH_STAGE[location.pathname as PATH];

    return (
        <div className="base">
            <WindowManager>
                {/* TODO Group to the background */}
                <div className="base__gradient">
                    <div className="base__gradient-left" />
                    <div className="base__gradient-right" />
                </div>
                <div className="base__blur" />
                <div className="base__glow" />
                {/* FIXME Use id, not key */}
                <div
                    className="base__overlay"
                    style={{
                        backgroundColor: STAGE_DATA[stage].color,
                    }}
                />
                <header>
                    <div className="base__header">
                        <div>{props.logo}</div>
                        <div>{props.menu}</div>
                    </div>
                </header>
                <main>
                    <div className="base__body">
                        <div className="base__body-stage">{props.stage}</div>
                        <div className="base__body-content">{props.content}</div>
                    </div>
                </main>
                <footer>
                    <div className="base__footer">{props.footer}</div>
                </footer>
            </WindowManager>
        </div>
    );
};

Base.displayName = 'Base';

export default memo(Base);
